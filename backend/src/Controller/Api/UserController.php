<?php

namespace App\Controller\Api;

use App\Entity\Follow;
use App\Entity\User;
use App\Repository\FollowRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api')]
class UserController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private UserRepository $userRepository,
        private FollowRepository $followRepository
    ) {
    }

    #[Route('/users/{id}/follow', name: 'api_user_follow', methods: ['POST'])]
    #[IsGranted('ROLE_USER')]
    public function follow(User $userToFollow): JsonResponse
    {
        $currentUser = $this->getUser();

        // Vérifier qu'on ne suit pas déjà l'utilisateur
        if ($this->followRepository->findOneBy(['follower' => $currentUser, 'followed' => $userToFollow])) {
            return $this->json(['error' => 'You are already following this user'], 400);
        }

        // Vérifier qu'on n'essaie pas de se suivre soi-même
        if ($currentUser === $userToFollow) {
            return $this->json(['error' => 'You cannot follow yourself'], 400);
        }

        $follow = new Follow();
        $follow->setFollower($currentUser)
            ->setFollowed($userToFollow);

        $this->entityManager->persist($follow);
        $this->entityManager->flush();

        return $this->json(['message' => 'Successfully followed user'], 201);
    }

    #[Route('/users/{id}/unfollow', name: 'api_user_unfollow', methods: ['POST'])]
    #[IsGranted('ROLE_USER')]
    public function unfollow(User $userToUnfollow): JsonResponse
    {
        $currentUser = $this->getUser();

        $follow = $this->followRepository->findOneBy([
            'follower' => $currentUser,
            'followed' => $userToUnfollow
        ]);

        if (!$follow) {
            return $this->json(['error' => 'You are not following this user'], 400);
        }

        $this->entityManager->remove($follow);
        $this->entityManager->flush();

        return $this->json(['message' => 'Successfully unfollowed user']);
    }

    #[Route('/users/{id}/followers', name: 'api_user_followers', methods: ['GET'])]
    public function followers(User $user, Request $request): JsonResponse
    {
        $page = $request->query->getInt('page', 1);
        $limit = $request->query->getInt('limit', 20);
        
        $followers = $this->followRepository->getFollowers($user, $page, $limit);
        
        return $this->json([
            'followers' => $followers,
            'page' => $page,
            'limit' => $limit,
            'total' => count($followers)
        ], 200, [], ['groups' => ['user:read']]);
    }

    #[Route('/users/{id}/following', name: 'api_user_following', methods: ['GET'])]
    public function following(User $user, Request $request): JsonResponse
    {
        $page = $request->query->getInt('page', 1);
        $limit = $request->query->getInt('limit', 20);
        
        $following = $this->followRepository->getFollowing($user, $page, $limit);
        
        return $this->json([
            'following' => $following,
            'page' => $page,
            'limit' => $limit,
            'total' => count($following)
        ], 200, [], ['groups' => ['user:read']]);
    }

    #[Route('/users/search', name: 'api_users_search', methods: ['GET'])]
    public function search(Request $request): JsonResponse
    {
        $query = $request->query->get('q');
        $page = $request->query->getInt('page', 1);
        $limit = $request->query->getInt('limit', 20);

        if (!$query) {
            return $this->json(['error' => 'Query parameter is required'], 400);
        }

        $users = $this->userRepository->search($query, $page, $limit);

        return $this->json([
            'users' => $users,
            'page' => $page,
            'limit' => $limit,
            'total' => count($users)
        ], 200, [], ['groups' => ['user:read']]);
    }

    #[Route('/users/{id}/suggested', name: 'api_users_suggested', methods: ['GET'])]
    #[IsGranted('ROLE_USER')]
    public function suggestedUsers(Request $request): JsonResponse
    {
        $limit = $request->query->getInt('limit', 10);
        $users = $this->userRepository->getSuggestedUsers($this->getUser(), $limit);

        return $this->json([
            'users' => $users,
            'limit' => $limit,
            'total' => count($users)
        ], 200, [], ['groups' => ['user:read']]);
    }
} 