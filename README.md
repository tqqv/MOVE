# MOVE

### init local db

1. Kết nối đến MySQL bằng tài khoản root hoặc tài khoản có đủ quyền:
   mysql -u root -p;

2. Tạo cơ sở dữ liệu:
   CREATE DATABASE `move`;

3. Chọn cơ sở dữ liệu:
   USE `move`;

4. Thoát mysql

- exit

### update local database/ cập nhật local database nếu có thay đổi trong file migration

1.  Chạy migration
    - npx sequelize-cli db:migrate

### modify table // thêm xóa thuộc tính hay sử bảng trên table

1.  Update file model
2.  Tạo migration

    ### Case: thay đổi thêm/xóa/update thuộc tính

        - Tạo migration mới cho bản đó trong db
            - npx sequelize-cli migration:generate --name migration-name
        vd: npx sequelize-cli migration:generate --name  add-age-to-user
            => Sau khi tạo thành công thì check trong folder migrations sẽ có file.js về migration đó. (...-create-tablename.js)

    ### Case: thêm bảng

        - Tạo migration cho db
            - npx sequelize-cli migration:generate --name create-tablename
            => Sau khi tạo thành công thì check trong folder migrations sẽ có file.js về migration đó. (...-create-tablename.js)

3.  Chạy migration
    - npx sequelize-cli db:migrate

### Để ý có thể bug khi chạy mấy lệnh trên ở terminal

    - lệnh npx thường file chạy tới folder server mới dùng được.
    - lệnh mysql thường phải có ; ở cuối.
