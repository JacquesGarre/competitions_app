<?php

// src/DataPersister

namespace App\DataPersister;

use App\Entity\Registration;
use App\Repository\RegistrationRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RequestStack;
use ApiPlatform\Core\DataPersister\ContextAwareDataPersisterInterface;

/**
 *
 */
class RegistrationDataPersister implements ContextAwareDataPersisterInterface
{
    /**
     * @var EntityManagerInterface
     */
    private $_entityManager;

    /**
     * @param Request
     */
    private $_request;

    public function __construct(
        RegistrationRepository $repo,
        EntityManagerInterface $entityManager,
        RequestStack $request
    ) {
        $this->_entityManager = $entityManager;
        $this->repo = $repo;
        $this->_request = $request->getCurrentRequest();
    }

    /**
     * {@inheritdoc}
     */
    public function supports($data, array $context = []): bool
    {
        return $data instanceof Registration;
    }

    /**
     * @param Registration $data
     */
    public function persist($data, array $context = [])
    {

        // A l'update
        if ($this->_request->getMethod() !== 'POST') {
            $data->setUpdatedAt(new \DateTime());

        // A la creation
        } else {
            $totalRegistrations = $this->repo->countByTournament($data->getTournament());
            $totalRegistrations++;
            $data->setJerseyNumber($totalRegistrations);
            $data->setCreatedAt(new \DateTimeImmutable());
        }
        
        $this->_entityManager->persist($data);
        $this->_entityManager->flush();
    }    
    
    /**
    * {@inheritdoc}
    */
   public function remove($data, array $context = [])
   {
       $this->_entityManager->remove($data);
       $this->_entityManager->flush();
   }

}