"use client";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import React from 'react';
import { useForm } from 'react-hook-form';
import { api } from "@/trpc/react";
import { toast } from 'sonner';
import useRefetch from '@/hooks/use-refatch';
import Image from 'next/image';

type FormInput = {
  githubUrl: string,
  name: string,
  githubToken: string
};

const Page = () => {
  const { register, handleSubmit, reset } = useForm<FormInput>();
  const Create = api.project.createProject.useMutation();
  const refetch = useRefetch();

  const OnSubmit = async (data: FormInput) => {
    try {
      console.log("Mutation input:", data);
      Create.mutate(
        {
          githubUrl: data.githubUrl,
          name: data.name,
          githubToken: data.githubToken,
        },
        {
          onSuccess: () => {
            refetch();
            toast.success("Project created successfully");
            reset();
          },
          onError: () => {
            toast.error("Failed to create project");
          },
        }
      );
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  return (
    <div className='flex items-center gap-40 h-full justify-center'>
      <div className='h-96 w-96 relative'>
      <Image
      src="/wo.png"
      alt="Dinoysus"
      width={400}
      height={400}
     
    priority
      
      />
      
      </div>
      
      <div>
        <h1 className='font-semibold text-2xl'>
          Link with Github Repository
        </h1>
        <p className='text-sm text-muted-foreground'>
          Enter the URL of your repository to link it to Dinoysus
        </p>
        <div className='h-4'></div>
        <form onSubmit={handleSubmit(OnSubmit)}>
          <Input {...register('name', { required: true })} placeholder='Name' />
          <div className='h-4'></div>
          <Input
            {...register('githubUrl', { required: true })}
            placeholder='GitHub URL'
            type='url'
          />
          <div className='h-4'></div>
          <Input {...register('githubToken')} placeholder='GitHub Token (Optional)' />
          <div className='h-4'></div>
          <Button type='submit' disabled={Create.isPending}>Create Project</Button>
        </form>
      </div>
    </div>
  );
};

export default Page;