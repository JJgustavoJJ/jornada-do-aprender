import "dotenv/config";
import mysql from "mysql2/promise";

const students = [
  [1, "Amaya Santos Sepulveda", "F"],
  [2, "Angelo Ciccillo Gomes Cogliatti", "M"],
  [3, "Anna Alice Pereira Sena", "F"],
  [4, "ANTHONY REZENDE SANT ANNA", "M"],
  [5, "Anthony Zaia Carvelli", "M"],
  [6, "Arthur Miguel Cáceres dos Santos", "M"],
  [7, "BENÍCIO MAIA FERREIRA", "M"],
  [8, "Benício Zaia Carvelli", "M"],
  [9, "BENJAMIM SALES CABRAL", "M"],
  [10, "Benjamin Luz Araujo", "F"],
  [11, "Bernardo Alves Mathias de Oliveira", "M"],
  [12, "Brendha Araujo Marcondes", "F"],
  [13, "Cecília Gomes Bezerra", "F"],
  [14, "Cecília Raiol Selbach", "F"],
  [15, "Cecília Ziemba Vera Sarraipa Brescancin", "F"],
  [16, "Davi de Souza Belentani Teixeira", "M"],
  [17, "DAVI SOUZA VENTURA", "F"],
  [18, "Emanuelly Gomes Correia", "F"],
  [19, "GABRIEL HENRIQUE DA SILVA BARROS", "M"],
  [20, "HELENA FERREIRA SERRA", "F"],
  [21, "Heloísa Troiani Costa", "F"],
  [22, "Henrique Fernandes Inoue Hamada", "M"],
  [23, "ISAQUE FERREIRA SANSAO", "M"],
  [24, "Liz Farina Dias", "F"],
  [25, "Lorena Vitoria Bispo Sales Pereira", "F"],
  [26, "MARIA ALICE LIMA DE SOUZA", "F"],
  [27, "MARIA CLARA VILHALBA LIMA FERREIRA", "F"],
  [28, "Mariah Zinezzi Albuquerque Alves", "F"],
  [29, "Paola Bezerra de Oliveira", "F"],
  [30, "PEDRO HENRIQUE LOPES DA SILVA", "M"],
  [31, "SOFIA COCHI OLIVEIRA", "F"],
  [32, "TAINÁ COCHI OLIVEIRA", "F"],
  [33, "Helena Oliveira Marques", "F"],
  [34, "Lunna Catarina dos Santos", "F"],
];

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL não configurada. Crie o arquivo .env antes de executar este comando.");
}

const connection = await mysql.createConnection(process.env.DATABASE_URL);

try {
  await connection.query(`
    CREATE TABLE IF NOT EXISTS students (
      id INT AUTO_INCREMENT PRIMARY KEY,
      studentNumber INT NOT NULL UNIQUE,
      name VARCHAR(160) NOT NULL UNIQUE,
      sex ENUM('F', 'M') NOT NULL,
      createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
  `);

  await connection.query(
    `INSERT INTO students (studentNumber, name, sex)
     VALUES ?
     ON DUPLICATE KEY UPDATE
       name = VALUES(name),
       sex = VALUES(sex),
       updatedAt = CURRENT_TIMESTAMP`,
    [students],
  );

  const [rows] = await connection.query("SELECT studentNumber, name, sex FROM students ORDER BY studentNumber");
  console.log(`Cadastro atualizado: ${rows.length} alunos.`);
} finally {
  await connection.end();
}
