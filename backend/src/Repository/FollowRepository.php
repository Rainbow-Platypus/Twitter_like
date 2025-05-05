<?php

namespace App\Repository;

use App\Entity\Follow;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Follow>
 *
 * @method Follow|null find($id, $lockMode = null, $lockVersion = null)
 * @method Follow|null findOneBy(array $criteria, array $orderBy = null)
 * @method Follow[]    findAll()
 * @method Follow[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class FollowRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Follow::class);
    }

    /**
     * Get user's followers with pagination
     */
    public function getFollowers(User $user, int $page = 1, int $limit = 20): array
    {
        $offset = ($page - 1) * $limit;

        return $this->createQueryBuilder('f')
            ->select('DISTINCT u')
            ->join('f.follower', 'u')
            ->where('f.followed = :user')
            ->setParameter('user', $user)
            ->orderBy('f.createdAt', 'DESC')
            ->setMaxResults($limit)
            ->setFirstResult($offset)
            ->getQuery()
            ->getResult();
    }

    /**
     * Get users that a user is following with pagination
     */
    public function getFollowing(User $user, int $page = 1, int $limit = 20): array
    {
        $offset = ($page - 1) * $limit;

        return $this->createQueryBuilder('f')
            ->select('DISTINCT u')
            ->join('f.followed', 'u')
            ->where('f.follower = :user')
            ->setParameter('user', $user)
            ->orderBy('f.createdAt', 'DESC')
            ->setMaxResults($limit)
            ->setFirstResult($offset)
            ->getQuery()
            ->getResult();
    }

    /**
     * Check if a user is following another user
     */
    public function isFollowing(User $follower, User $followed): bool
    {
        $result = $this->createQueryBuilder('f')
            ->select('COUNT(f.id)')
            ->where('f.follower = :follower')
            ->andWhere('f.followed = :followed')
            ->setParameter('follower', $follower)
            ->setParameter('followed', $followed)
            ->getQuery()
            ->getSingleScalarResult();

        return $result > 0;
    }

    /**
     * Get mutual followers between two users
     */
    public function getMutualFollowers(User $user1, User $user2): array
    {
        return $this->createQueryBuilder('f1')
            ->select('DISTINCT u')
            ->join('f1.follower', 'u')
            ->join(Follow::class, 'f2', 'WITH', 'f2.follower = u')
            ->where('f1.followed = :user1')
            ->andWhere('f2.followed = :user2')
            ->setParameter('user1', $user1)
            ->setParameter('user2', $user2)
            ->getQuery()
            ->getResult();
    }
} 