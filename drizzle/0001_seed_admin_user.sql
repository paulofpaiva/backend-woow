-- Usuario inicial de prueba (admin): email admin@gmail.com, password 12345678
INSERT INTO "users" ("name", "email", "password", "role")
VALUES (
  'Admin',
  'admin@gmail.com',
  '$2a$10$BhVuRxu8auDaQslxe77qD.P7HADV437E0aB1rcMx8ACrdMZv.oRMG',
  'admin'
)
ON CONFLICT ("email") DO NOTHING;
