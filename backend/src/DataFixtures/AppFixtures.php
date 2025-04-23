<?php

namespace App\DataFixtures;

use App\Entity\User;
use App\Entity\Tweet;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class AppFixtures extends Fixture
{
    private UserPasswordHasherInterface $passwordHasher;

    public function __construct(UserPasswordHasherInterface $passwordHasher)
    {
        $this->passwordHasher = $passwordHasher;
    }

    public function load(ObjectManager $manager): void
    {
        // Création d'un utilisateur admin
        $admin = new User();
        $admin->setEmail('admin@example.com');
        $admin->setUsername('admin');
        $admin->setRoles(['ROLE_ADMIN']);
        
        $hashedPassword = $this->passwordHasher->hashPassword(
            $admin,
            'admin123'
        );
        $admin->setPassword($hashedPassword);

        $manager->persist($admin);

        // Création d'un utilisateur test
        $user = new User();
        $user->setEmail('user@example.com');
        $user->setUsername('user');
        
        $hashedPassword = $this->passwordHasher->hashPassword(
            $user,
            'user123'
        );
        $user->setPassword($hashedPassword);

        $manager->persist($user);

        // Création de quelques tweets de test
        $tweets = [
            'Bienvenue sur notre clone de Twitter !',
            'Ceci est un tweet de test',
            'N\'hésitez pas à créer votre compte'
        ];

        foreach ($tweets as $content) {
            $tweet = new Tweet();
            $tweet->setContent($content);
            $tweet->setAuthor($admin);
            $manager->persist($tweet);
        }

        $manager->flush();
    }
}
