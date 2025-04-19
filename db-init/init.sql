-- Criação da tabela 'roles' (se não existir)
CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- Criação da tabela 'steps' (se não existir)
CREATE TABLE IF NOT EXISTS steps (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- Remover duplicatas, se existirem
WITH cte AS (
    SELECT MIN(id) AS keep_id, name
    FROM roles
    GROUP BY name
)
DELETE FROM roles
WHERE id NOT IN (SELECT keep_id FROM cte);

-- Remover duplicatas, se existirem
WITH cte AS (
    SELECT MIN(id) AS keep_id, name
    FROM steps
    GROUP BY name
)
DELETE FROM steps
WHERE id NOT IN (SELECT keep_id FROM cte);

-- Adicionar a restrição UNIQUE para a coluna 'name' da tabela 'roles'
ALTER TABLE roles ADD CONSTRAINT roles_name_unique UNIQUE (name);

-- Inserir o valor 'Administrativo' na tabela 'roles'
INSERT INTO roles (name) VALUES ('Administrativo') ON CONFLICT (name) DO NOTHING;
INSERT INTO roles (name) VALUES ('Técnico') ON CONFLICT (name) DO NOTHING;
INSERT INTO roles (name) VALUES ('Enfermagem') ON CONFLICT (name) DO NOTHING;

-- Adicionar a restrição UNIQUE para a coluna 'name' da tabela 'roles'
ALTER TABLE steps ADD CONSTRAINT steps_name_unique UNIQUE (name);

-- Inserir o valor 'Administrativo' na tabela 'roles'
INSERT INTO steps (name) VALUES ('Recebimento') ON CONFLICT (name) DO NOTHING;
INSERT INTO steps (name) VALUES ('Lavagem') ON CONFLICT (name) DO NOTHING;
INSERT INTO steps (name) VALUES ('Esterilização') ON CONFLICT (name) DO NOTHING;
INSERT INTO steps (name) VALUES ('Distribuição') ON CONFLICT (name) DO NOTHING;

-- Criação da tabela 'users' (se não existir)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role_id INTEGER REFERENCES roles(id),
    active BOOLEAN DEFAULT true,
    is_deleted BOOLEAN DEFAULT false
);

-- Inserir o usuário admin na tabela 'users'
INSERT INTO users (name, username, password, role_id, active, is_deleted) 
VALUES ('admin', 'admin', '$2b$10$sT20cs23h9y5kRW9EGmmjerh1h7tMce7JZ1ehnFqjBPbDXBHeh5g.', 1, true, false)
ON CONFLICT (username) DO NOTHING;
