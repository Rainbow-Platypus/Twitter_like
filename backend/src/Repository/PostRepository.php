<?php

namespace App\Repository;

use App\Entity\Post;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Post>
 *
 * @method Post|null find($id, $lockMode = null, $lockVersion = null)
 * @method Post|null findOneBy(array $criteria, array $orderBy = null)
 * @method Post[]    findAll()
 * @method Post[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class PostRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Post::class);
    }

    /**
     * Get user's feed posts (posts from followed users)
     */
    public function getFeed(User $user, int $page = 1, int $limit = 20): array
    {
        $offset = ($page - 1) * $limit;

        return $this->createQueryBuilder('p')
            ->leftJoin('p.user', 'author')
            ->leftJoin('author.followers', 'f')
            ->where('f.follower = :user')
            ->orWhere('p.user = :user')
            ->setParameter('user', $user)
            ->orderBy('p.createdAt', 'DESC')
            ->setMaxResults($limit)
            ->setFirstResult($offset)
            ->getQuery()
            ->getResult();
    }

    /**
     * Get trending posts based on engagement (likes + retweets + quotes + comments)
     */
    public function getTrending(int $limit = 10): array
    {
        $twentyFourHoursAgo = new \DateTimeImmutable('-24 hours');

        return $this->createQueryBuilder('p')
            ->where('p.createdAt >= :timeLimit')
            ->setParameter('timeLimit', $twentyFourHoursAgo)
            ->orderBy('p.likesCount + p.retweetsCount + p.quotesCount + p.commentsCount', 'DESC')
            ->setMaxResults($limit)
            ->getQuery()
            ->getResult();
    }

    /**
     * Get posts by hashtag
     */
    public function findByHashtag(string $hashtag, int $page = 1, int $limit = 20): array
    {
        $offset = ($page - 1) * $limit;

        return $this->createQueryBuilder('p')
            ->where('p.content LIKE :hashtag')
            ->setParameter('hashtag', '%#' . $hashtag . '%')
            ->orderBy('p.createdAt', 'DESC')
            ->setMaxResults($limit)
            ->setFirstResult($offset)
            ->getQuery()
            ->getResult();
    }

    /**
     * Search posts by content
     */
    public function search(string $query, int $page = 1, int $limit = 20): array
    {
        $offset = ($page - 1) * $limit;

        return $this->createQueryBuilder('p')
            ->where('p.content LIKE :query')
            ->setParameter('query', '%' . $query . '%')
            ->orderBy('p.createdAt', 'DESC')
            ->setMaxResults($limit)
            ->setFirstResult($offset)
            ->getQuery()
            ->getResult();
    }
} 