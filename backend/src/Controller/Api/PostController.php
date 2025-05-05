<?php

namespace App\Controller\Api;

use App\Entity\Post;
use App\Entity\Media;
use App\Repository\PostRepository;
use App\Repository\MediaRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\String\Slugger\SluggerInterface;

#[Route('/api')]
class PostController extends AbstractController
{
    private string $uploadDir;

    public function __construct(
        private EntityManagerInterface $entityManager,
        private PostRepository $postRepository,
        private MediaRepository $mediaRepository,
        private SluggerInterface $slugger,
        string $uploadDir = 'uploads'
    ) {
        $this->uploadDir = $uploadDir;
    }

    #[Route('/posts', name: 'api_posts_create', methods: ['POST'])]
    #[IsGranted('ROLE_USER')]
    public function create(Request $request): JsonResponse
    {
        // Récupérer le contenu depuis FormData
        $content = $request->request->get('content');
        $file = $request->files->get('image');
        
        if (!$content) {
            return $this->json(['error' => 'Content is required'], Response::HTTP_BAD_REQUEST);
        }

        $post = new Post();
        $post->setContent($content)
            ->setUser($this->getUser())
            ->setType('post');

        // Gérer l'upload d'image si présent
        if ($file) {
            $originalFilename = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
            $safeFilename = $this->slugger->slug($originalFilename);
            $newFilename = $safeFilename . '-' . uniqid() . '.' . $file->guessExtension();

            try {
                $file->move(
                    $this->getParameter('kernel.project_dir') . '/public/' . $this->uploadDir,
                    $newFilename
                );

                $media = new Media();
                $media->setFilename($newFilename)
                    ->setOriginalName($file->getClientOriginalName())
                    ->setMimeType($file->getMimeType())
                    ->setSize($file->getSize())
                    ->setOwner($this->getUser());

                $this->entityManager->persist($media);
                $post->setMedia($media);
            } catch (\Exception $e) {
                return $this->json(
                    ['error' => 'Error uploading file: ' . $e->getMessage()],
                    Response::HTTP_INTERNAL_SERVER_ERROR
                );
            }
        }

        $this->entityManager->persist($post);
        $this->entityManager->flush();

        return $this->json($post, Response::HTTP_CREATED, [], ['groups' => ['post:read']]);
    }

    #[Route('/posts/feed', name: 'api_posts_feed', methods: ['GET'])]
    #[IsGranted('ROLE_USER')]
    public function feed(Request $request): JsonResponse
    {
        $page = $request->query->getInt('page', 1);
        $limit = $request->query->getInt('limit', 20);
        
        $user = $this->getUser();
        $posts = $this->postRepository->getFeed($user, $page, $limit);
        
        return $this->json([
            'posts' => $posts,
            'page' => $page,
            'limit' => $limit,
            'total' => count($posts)
        ], Response::HTTP_OK, [], ['groups' => ['post:read']]);
    }

    #[Route('/posts/{id}/retweet', name: 'api_post_retweet', methods: ['POST'])]
    #[IsGranted('ROLE_USER')]
    public function retweet(Post $post): JsonResponse
    {
        $user = $this->getUser();
        
        $retweet = new Post();
        $retweet->setUser($user)
            ->setType('retweet')
            ->setContent($post->getContent());
        
        if ($post->getMedia()) {
            $retweet->setMedia($post->getMedia());
        }
        
        $post->incrementRetweetsCount();
        
        $this->entityManager->persist($retweet);
        $this->entityManager->flush();
        
        return $this->json($retweet, Response::HTTP_CREATED, [], ['groups' => ['post:read']]);
    }

    #[Route('/posts/{id}/quote', name: 'api_post_quote', methods: ['POST'])]
    #[IsGranted('ROLE_USER')]
    public function quote(Post $post, Request $request): JsonResponse
    {
        $user = $this->getUser();
        $content = json_decode($request->getContent(), true)['content'] ?? null;
        
        if (!$content) {
            return $this->json(['error' => 'Content is required'], Response::HTTP_BAD_REQUEST);
        }
        
        $quote = new Post();
        $quote->setUser($user)
            ->setType('quote')
            ->setContent($content);
        
        if ($post->getMedia()) {
            $quote->setMedia($post->getMedia());
        }
        
        $post->incrementQuotesCount();
        
        $this->entityManager->persist($quote);
        $this->entityManager->flush();
        
        return $this->json($quote, Response::HTTP_CREATED, [], ['groups' => ['post:read']]);
    }

    #[Route('/posts/trending', name: 'api_posts_trending', methods: ['GET'])]
    public function trending(Request $request): JsonResponse
    {
        $limit = $request->query->getInt('limit', 10);
        $posts = $this->postRepository->getTrending($limit);
        
        return $this->json($posts, Response::HTTP_OK, [], ['groups' => ['post:read']]);
    }
} 