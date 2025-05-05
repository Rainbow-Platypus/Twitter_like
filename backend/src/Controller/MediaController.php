<?php

namespace App\Controller;

use App\Entity\Media;
use App\Repository\MediaRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\String\Slugger\SluggerInterface;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/media')]
class MediaController extends AbstractController
{
    private string $uploadDir;

    public function __construct(string $uploadDir = 'uploads')
    {
        $this->uploadDir = $uploadDir;
    }

    #[Route('', name: 'app_media_upload', methods: ['POST'])]
    #[IsGranted('ROLE_USER')]
    public function upload(
        Request $request,
        MediaRepository $mediaRepository,
        SluggerInterface $slugger
    ): JsonResponse {
        /** @var UploadedFile $file */
        $file = $request->files->get('file');

        if (!$file) {
            return $this->json(['message' => 'No file uploaded'], Response::HTTP_BAD_REQUEST);
        }

        $originalFilename = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $safeFilename = $slugger->slug($originalFilename);
        $newFilename = $safeFilename . '-' . uniqid() . '.' . $file->guessExtension();

        try {
            $file->move(
                $this->getParameter('kernel.project_dir') . '/public/' . $this->uploadDir,
                $newFilename
            );

            $media = new Media();
            $media->setFilename($newFilename);
            $media->setOriginalName($file->getClientOriginalName());
            $media->setMimeType($file->getMimeType());
            $media->setSize($file->getSize());
            $media->setOwner($this->getUser());

            $mediaRepository->save($media, true);

            return $this->json($media, Response::HTTP_CREATED, [], ['groups' => 'media:read']);
        } catch (\Exception $e) {
            return $this->json(['message' => 'Error uploading file: ' . $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[Route('/{id}', name: 'app_media_delete', methods: ['DELETE'])]
    #[IsGranted('ROLE_USER')]
    public function delete(
        Media $media,
        MediaRepository $mediaRepository
    ): JsonResponse {
        if ($media->getOwner() !== $this->getUser()) {
            return $this->json(['message' => 'Access denied'], Response::HTTP_FORBIDDEN);
        }

        $filename = $media->getFilename();
        $filepath = $this->getParameter('kernel.project_dir') . '/public/' . $this->uploadDir . '/' . $filename;

        if (file_exists($filepath)) {
            unlink($filepath);
        }

        $mediaRepository->remove($media, true);

        return $this->json(null, Response::HTTP_NO_CONTENT);
    }

    #[Route('', name: 'app_media_list', methods: ['GET'])]
    public function list(MediaRepository $mediaRepository): JsonResponse
    {
        $media = $mediaRepository->findAll();
        return $this->json($media, Response::HTTP_OK, [], ['groups' => 'media:read']);
    }
} 