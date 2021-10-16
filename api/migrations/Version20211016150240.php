<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20211016150240 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE pool ADD tournament_id INT NOT NULL');
        $this->addSql('ALTER TABLE pool ADD CONSTRAINT FK_AF91A98633D1A3E7 FOREIGN KEY (tournament_id) REFERENCES tournament (id)');
        $this->addSql('CREATE INDEX IDX_AF91A98633D1A3E7 ON pool (tournament_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE pool DROP FOREIGN KEY FK_AF91A98633D1A3E7');
        $this->addSql('DROP INDEX IDX_AF91A98633D1A3E7 ON pool');
        $this->addSql('ALTER TABLE pool DROP tournament_id');
    }
}
