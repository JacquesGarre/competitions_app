<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20211009163338 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        //$this->addSql('ALTER TABLE tournament DROP FOREIGN KEY FK_BD5FB8D9B03A8386');
        //$this->addSql('DROP INDEX IDX_BD5FB8D9B03A8386 ON tournament');
        //$this->addSql('ALTER TABLE tournament CHANGE created_by_id creator_id INT NOT NULL');
        //$this->addSql('ALTER TABLE tournament ADD CONSTRAINT FK_BD5FB8D961220EA6 FOREIGN KEY (creator_id) REFERENCES user (id)');
        //$this->addSql('CREATE INDEX IDX_BD5FB8D961220EA6 ON tournament (creator_id)');
        //$this->addSql('ALTER TABLE user CHANGE roles roles JSON NOT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE tournament DROP FOREIGN KEY FK_BD5FB8D961220EA6');
        $this->addSql('DROP INDEX IDX_BD5FB8D961220EA6 ON tournament');
        $this->addSql('ALTER TABLE tournament CHANGE creator_id created_by_id INT NOT NULL');
        $this->addSql('ALTER TABLE tournament ADD CONSTRAINT FK_BD5FB8D9B03A8386 FOREIGN KEY (created_by_id) REFERENCES user (id)');
        $this->addSql('CREATE INDEX IDX_BD5FB8D9B03A8386 ON tournament (created_by_id)');
        //$this->addSql('ALTER TABLE user CHANGE roles roles TEXT CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`');
    }
}
