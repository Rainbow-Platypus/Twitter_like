<?php

namespace App\Service;

use App\Entity\Media;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\String\Slugger\SluggerInterface;
use Intervention\Image\ImageManager;

class MediaService
{
    private ImageManager $imageManager;

    public function __construct(
        private string $mediaDirectory,
        private SluggerInterface $slugger
    ) {
        $this->imageManager = new ImageManager(['driver' => 'gd']);
    }

    public function uploadMedia(UploadedFile $file): Media
    {
        $originalFilename = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $safeFilename = $this->slugger->slug($originalFilename);
        $fileName = $safeFilename . '-' . uniqid() . '.' . $file->guessExtension();

        $media = new Media();
        $media->setOriginalName($originalFilename)
            ->setMimeType($file->getMimeType())
            ->setSize($file->getSize())
            ->setFilename($fileName);

        // Déplacer le fichier
        $file->move($this->mediaDirectory, $fileName);

        // Si c'est une image, créer les versions redimensionnées
        if (str_starts_with($file->getMimeType(), 'image/')) {
            $this->createImageVariants($fileName);
        }

        return $media;
    }

    private function createImageVariants(string $fileName): void
    {
        $originalPath = $this->mediaDirectory . '/' . $fileName;
        $image = $this->imageManager->make($originalPath);

        // Thumbnail (150x150)
        $image->fit(150, 150)
            ->save($this->mediaDirectory . '/thumb_' . $fileName);

        // Medium (600x600 max)
        $image = $this->imageManager->make($originalPath);
        $image->resize(600, 600, function ($constraint) {
            $constraint->aspectRatio();
            $constraint->upsize();
        })->save($this->mediaDirectory . '/medium_' . $fileName);
    }

    public function deleteMedia(Media $media): void
    {
        $filePath = $this->mediaDirectory . '/' . $media->getFilename();
        if (file_exists($filePath)) {
            unlink($filePath);
            
            // Supprimer les variantes si elles existent
            if (str_starts_with($media->getMimeType(), 'image/')) {
                @unlink($this->mediaDirectory . '/thumb_' . $media->getFilename());
                @unlink($this->mediaDirectory . '/medium_' . $media->getFilename());
            }
        }
    }
} 