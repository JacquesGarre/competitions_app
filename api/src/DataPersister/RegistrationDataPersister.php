<?php

// src/DataPersister

namespace App\DataPersister;

use App\Entity\Registration;
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
        EntityManagerInterface $entityManager,
        RequestStack $request
    ) {
        $this->_entityManager = $entityManager;
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
        // Set the updatedAt value if it's not a POST request
        if ($this->_request->getMethod() !== 'POST') {
            $data->setUpdatedAt(new \DateTime());
        } else {
            $data->setCreatedAt(new \DateTimeImmutable());
        }
        

        // JERSEY NUMBER // Get last registration by tournament id + 1
        $data->setJerseyNumber(50);

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