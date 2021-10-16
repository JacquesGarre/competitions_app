<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20211016150014 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE pool (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, min_points INT DEFAULT NULL, max_points INT DEFAULT NULL, price DOUBLE PRECISION DEFAULT NULL, description LONGTEXT DEFAULT NULL, created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', updated_at DATETIME DEFAULT NULL, start_date DATETIME DEFAULT NULL, end_date DATETIME DEFAULT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE pool_user (pool_id INT NOT NULL, user_id INT NOT NULL, INDEX IDX_B3DC70E7B3406DF (pool_id), INDEX IDX_B3DC70EA76ED395 (user_id), PRIMARY KEY(pool_id, user_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE pool_user ADD CONSTRAINT FK_B3DC70E7B3406DF FOREIGN KEY (pool_id) REFERENCES pool (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE pool_user ADD CONSTRAINT FK_B3DC70EA76ED395 FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE pool_user DROP FOREIGN KEY FK_B3DC70E7B3406DF');
        $this->addSql('DROP TABLE pool');
        $this->addSql('DROP TABLE pool_user');
    }
}
