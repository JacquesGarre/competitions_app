<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20211017102046 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE registration (id INT AUTO_INCREMENT NOT NULL, user_id INT NOT NULL, tournament_id INT NOT NULL, creator_id INT NOT NULL, payable_amount DOUBLE PRECISION DEFAULT NULL, paid_amount DOUBLE PRECISION DEFAULT NULL, jersey_number INT NOT NULL, presence TINYINT(1) NOT NULL, created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', updated_at DATETIME DEFAULT NULL, available TINYINT(1) NOT NULL, INDEX IDX_62A8A7A7A76ED395 (user_id), INDEX IDX_62A8A7A733D1A3E7 (tournament_id), INDEX IDX_62A8A7A761220EA6 (creator_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE registration_pool (registration_id INT NOT NULL, pool_id INT NOT NULL, INDEX IDX_60AFBE5A833D8F43 (registration_id), INDEX IDX_60AFBE5A7B3406DF (pool_id), PRIMARY KEY(registration_id, pool_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE registration ADD CONSTRAINT FK_62A8A7A7A76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE registration ADD CONSTRAINT FK_62A8A7A733D1A3E7 FOREIGN KEY (tournament_id) REFERENCES tournament (id)');
        $this->addSql('ALTER TABLE registration ADD CONSTRAINT FK_62A8A7A761220EA6 FOREIGN KEY (creator_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE registration_pool ADD CONSTRAINT FK_60AFBE5A833D8F43 FOREIGN KEY (registration_id) REFERENCES registration (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE registration_pool ADD CONSTRAINT FK_60AFBE5A7B3406DF FOREIGN KEY (pool_id) REFERENCES pool (id) ON DELETE CASCADE');
        $this->addSql('DROP TABLE pool_user');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE registration_pool DROP FOREIGN KEY FK_60AFBE5A833D8F43');
        $this->addSql('CREATE TABLE pool_user (pool_id INT NOT NULL, user_id INT NOT NULL, INDEX IDX_B3DC70EA76ED395 (user_id), INDEX IDX_B3DC70E7B3406DF (pool_id), PRIMARY KEY(pool_id, user_id)) DEFAULT CHARACTER SET utf8 COLLATE `utf8_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('ALTER TABLE pool_user ADD CONSTRAINT FK_B3DC70E7B3406DF FOREIGN KEY (pool_id) REFERENCES pool (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE pool_user ADD CONSTRAINT FK_B3DC70EA76ED395 FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE');
        $this->addSql('DROP TABLE registration');
        $this->addSql('DROP TABLE registration_pool');
    }
}
