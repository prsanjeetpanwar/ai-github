"use client";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import React from 'react';
import { useForm } from 'react-hook-form';
import { api } from "@/trpc/react";
import { toast } from 'sonner';
import useRefetch from '@/hooks/use-refatch';

type FormInput = {
  githubUrl: string,
  name: string,
  githubToken: string
};

const Page = () => {
  const { register, handleSubmit, reset } = useForm<FormInput>();
  const Create = api.project.createProject.useMutation();
  const refetch = useRefetch()


  const OnSubmit = async (data: FormInput) => {
    try {
      console.log("Mutation input:", data);
      Create.mutate(data);

      toast.success("Project Created Successfully");
      refetch();
      reset();
    } catch (error) {
      toast.error("Error Creating Project");
      console.error(error);
    }
  };

  return (
    <div className='flex items-center gap-40 h-full justify-center'>
      <h1 className='h-56 w-auto'>hello</h1>
      <div>
        <h1 className='font-semibold text-2xl'>
          Link with Github Repository
        </h1>
        <p className='text-sm text-muted-foreground'>
          Enter the URL of your repository to link it to Dinoysus
        </p>
        <div className='h-4'></div>
        <form onSubmit={handleSubmit(OnSubmit)}>
          <Input
            {...register('name', { required: true })}
            placeholder='Name'
          />
          <div className='h-4'></div>
          <Input
            {...register('githubUrl', { required: true })}
            placeholder='GitHub URL'
            type='url'
          />
          <div className='h-4'></div>
          <Input
            {...register('githubToken')}
            placeholder='GitHub Token (Optional)'
          />
          <div className='h-4'></div>
          <Button type='submit' disabled={Create.isPending}>
            Create Project
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Page;
