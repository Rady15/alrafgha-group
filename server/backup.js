const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const BACKUP_DIR = process.env.BACKUP_DIR || './backups';

const getBackupPath = () => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    return path.join(BACKUP_DIR, timestamp);
};

const backup = async () => {
    const backupPath = getBackupPath();
    fs.mkdirSync(backupPath, { recursive: true });

    const collections = await mongoose.connection.db.listCollections().toArray();
    const backupManifest = {
        timestamp: new Date().toISOString(),
        database: mongoose.connection.db.databaseName,
        collections: {}
    };

    for (const collection of collections) {
        const collectionName = collection.name;
        const documents = await mongoose.connection.db.collection(collectionName).find({}).toArray();
        const filePath = path.join(backupPath, `${collectionName}.json`);
        fs.writeFileSync(filePath, JSON.stringify(documents, null, 2));
        backupManifest.collections[collectionName] = documents.length;
        console.log(`Backed up ${collectionName}: ${documents.length} documents`);
    }

    fs.writeFileSync(path.join(backupPath, 'manifest.json'), JSON.stringify(backupManifest, null, 2));
    console.log(`Backup completed: ${backupPath}`);
    return backupPath;
};

const restore = async (backupPath, targetDb = null) => {
    if (!fs.existsSync(backupPath)) {
        throw new Error(`Backup not found: ${backupPath}`);
    }

    const manifestPath = path.join(backupPath, 'manifest.json');
    if (!fs.existsSync(manifestPath)) {
        throw new Error('Backup manifest not found');
    }

    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    console.log(`Restoring from backup: ${manifest.timestamp}`);

    let targetConnection = mongoose.connection;
    if (targetDb) {
        targetConnection = await mongoose.createConnection(`${mongoose.connection.host}/${targetDb}`).asPromise();
    }

    for (const [collectionName, count] of Object.entries(manifest.collections)) {
        const filePath = path.join(backupPath, `${collectionName}.json`);
        if (!fs.existsSync(filePath)) {
            console.warn(`Skipping ${collectionName}: file not found`);
            continue;
        }

        const documents = JSON.parse(fs.readFileSync(filePath, 'utf8'));

        // Drop existing collection
        try {
            await targetConnection.db.collection(collectionName).drop();
        } catch (e) {
            // Collection may not exist
        }

        if (documents.length > 0) {
            await targetConnection.db.collection(collectionName).insertMany(documents);
        }
        console.log(`Restored ${collectionName}: ${documents.length} documents`);
    }

    if (targetDb) {
        await targetConnection.close();
    }

    console.log('Restore completed');
};

const listBackups = () => {
    if (!fs.existsSync(BACKUP_DIR)) {
        return [];
    }
    return fs.readdirSync(BACKUP_DIR)
        .filter(dir => fs.statSync(path.join(BACKUP_DIR, dir)).isDirectory())
        .sort()
        .reverse();
};

const cleanupOldBackups = (keepCount = 7) => {
    const backups = listBackups();
    if (backups.length <= keepCount) return;

    const toDelete = backups.slice(keepCount);
    for (const backup of toDelete) {
        const backupPath = path.join(BACKUP_DIR, backup);
        fs.rmSync(backupPath, { recursive: true, force: true });
        console.log(`Deleted old backup: ${backup}`);
    }
};

module.exports = { backup, restore, listBackups, cleanupOldBackups };

// CLI support
if (require.main === module) {
    const command = process.argv[2];
    const arg = process.argv[3];

    mongoose.connect(process.env.DATABASE || 'mongodb://localhost:27017/alrafgha-group')
        .then(async () => {
            try {
                if (command === 'backup') {
                    await backup();
                } else if (command === 'restore') {
                    if (!arg) {
                        console.error('Usage: node backup.js restore <backup-path>');
                        process.exit(1);
                    }
                    await restore(arg);
                } else if (command === 'list') {
                    const backups = listBackups();
                    console.log('Available backups:');
                    backups.forEach(b => console.log(`  ${b}`));
                } else if (command === 'cleanup') {
                    cleanupOldBackups(parseInt(arg) || 7);
                } else {
                    console.log('Usage: node backup.js <backup|restore|list|cleanup> [arg]');
                }
            } catch (error) {
                console.error('Error:', error.message);
            } finally {
                await mongoose.disconnect();
                process.exit(0);
            }
        })
        .catch(err => {
            console.error('Database connection error:', err.message);
            process.exit(1);
        });
}
