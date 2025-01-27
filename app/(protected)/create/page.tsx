"use client";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import React from 'react';
import { useForm } from 'react-hook-form';
import { api } from "@/trpc/react";
import { toast } from 'sonner';
import useRefetch from '@/hooks/use-refatch';
import { Info } from 'lucide-react';

type FormInput = {
  githubUrl: string,
  name: string,
  githubToken: string
};

const Page = () => {
  const { register, handleSubmit, reset } = useForm<FormInput>();
  const Create = api.project.createProject.useMutation();
  const checkCredits=api.project.checkCredits.useMutation()
  const refetch = useRefetch()


  const OnSubmit = async (data: FormInput) => {
    
    try {

      if(!!checkCredits.data){
        console.log("Mutation input:", data);
        Create.mutate({
          githubUrl: data.githubUrl,
          name: data.name,
          githubToken: data.githubToken
        },{
          onSuccess: (data) => {
            refetch()
            toast.success("Project created successfully")
            reset()
          },
          onError: (error) => {
            toast.error("Failed to create project")
          }
        });
      }
      else {
          checkCredits.mutate({
            githubUrl: data.githubUrl,
            githubToken: data.githubToken
          })
      }
  

     
    } catch (error) {
      console.error("Error creating project:", error);
      
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
          {!! checkCredits.data && (
            <>
             <div className='mt-4 bg-orange-50 px-4 py-2
             rounded-md border border-orange-200 text-orange-700
             '>
              <div className='flex items-center gap-2'>
                <Info className='size-4'/>
                <p className='text-sm'>
                  You will be charged <strong>{checkCredits.data?.fileCount} credits for this repositaory</strong>
                </p>
              </div>
              <p className='text-sm text-blue-600 ml-6'>You have <strong>
                {checkCredits.data?.userCredits} credits remaining
                </strong></p>
             </div>
            </>
          )}
          <Button type='submit' disabled={Create.isPending}>
            Create Project
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Page;
