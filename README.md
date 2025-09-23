# MOVE

### Initialize Local Database

1. Connect to MySQL using the `root` user or an account with sufficient privileges:
   mysql -u root -p;

2. Create the database:
   CREATE DATABASE `move`;

3. Select the database:
   USE `move`;

4. Exit MySQL:
   exit;

---

### Update Local Database (If Migrations Change)

1. Run migrations:
   npx sequelize-cli db:migrate

---

### Modify Tables (Add/Remove/Update Fields or Create Tables)

1. Update the model file accordingly.

2. Generate migration:

   #### Case: Add/Remove/Update fields

   - Generate a new migration file:
     npx sequelize-cli migration:generate --name migration-name

     Example:
     npx sequelize-cli migration:generate --name add-age-to-user

     After generation, check the `migrations/` folder for the new file
     (e.g., `...-add-age-to-user.js`).

   #### Case: Add new table

   - Generate migration for the new table:
     npx sequelize-cli migration:generate --name create-tablename

     Example:
     npx sequelize-cli migration:generate --name create-users

     A new migration file will appear in the `migrations/` folder.

3. Run the migration:
   npx sequelize-cli db:migrate

---

### Notes

- `npx` commands should be run from the correct folder (usually the `/server` folder).
- MySQL commands must end with a `;`
