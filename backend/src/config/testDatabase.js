const mysql = require('mysql2/promise');

async function testConnection() {
    try {
        console.log('🔄 Testing database connection...');

        const connection = await mysql.createConnection({
            host: '127.0.0.1',
            port: 3306,
            user: 'root',
            password: '12345',
            database: 'knjiznica'
        });

        console.log('✅ Database connection successful!');

        const [tables] = await connection.execute("SHOW TABLES LIKE 'custom_books'");

        if (tables.length > 0) {
            console.log('✅ custom_books table exists');

            const [columns] = await connection.execute("DESCRIBE custom_books");
            console.log('📋 Table structure:');
            columns.forEach(col => {
                console.log(`  - ${col.Field}: ${col.Type}`);
            });

            const [rows] = await connection.execute("SELECT * FROM custom_books");
            console.log(`📊 Current rows in table: ${rows.length}`);
            if (rows.length > 0) {
                console.log('📚 Existing books:');
                rows.forEach((book, index) => {
                    console.log(`  ${index + 1}. ${book.title} by ${book.authors}`);
                });
            }
        } else {
            console.log('❌ custom_books table does NOT exist');
            console.log('🔧 You need to create the table first');
        }

        await connection.end();

    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        console.error('🔧 Check your MariaDB settings:');
        console.error('   - Is MariaDB running?');
        console.error('   - Is the password correct? (currently: "12345")');
        console.error('   - Does the database "library_app" exist?');
    }
}

testConnection();