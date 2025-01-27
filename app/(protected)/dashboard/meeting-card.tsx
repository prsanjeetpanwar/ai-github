"use client"
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Presentation, Upload, Copy } from 'lucide-react'
import React, { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'

const MeetingCard = () => {
    const [progress, setProgress] = useState(0)
    const [isUploading, setIsUploading] = useState(false)
    const [fileUrl, setFileUrl] = useState<string | null>(null)

    const simulateUpload = (file: File) => {
        return new Promise<string>((resolve) => {
            let uploadProgress = 0
            const uploadInterval = setInterval(() => {
                uploadProgress += 10
                setProgress(uploadProgress)

                if (uploadProgress >= 100) {
                    clearInterval(uploadInterval)
                    // Generate a mock URL
                    const mockUrl = `https://yourdomain.com/uploads/${file.name}`
                    resolve(mockUrl)
                }
            }, 200)
        })
    }

    const copyUrlToClipboard = () => {
        if (fileUrl) {
            navigator.clipboard.writeText(fileUrl)
            alert('URL copied to clipboard!')
        }
    }

    const { getInputProps, getRootProps } = useDropzone({
        accept: { 'audio/*': ['.mp3', '.wav', '.m4a'] },
        multiple: false,
        maxSize: 50_000_000,
        onDrop: async acceptedFiles => {
            setIsUploading(true)
            try {
                const file = acceptedFiles[0]
                console.log(`File accepted: ${file.name}, size: ${file.size} bytes`)
                
                const mockUploadPath = await simulateUpload(file)
                setFileUrl(mockUploadPath)
            } catch (error) {
                console.error('Error uploading file:', error)
                alert('Upload failed. Please try again.')
            } finally {
                setIsUploading(false)
            }
        },
        onDropRejected: fileRejections => {
            fileRejections.forEach(({ errors }) => {
                errors.forEach(e => {
                    alert(e.message)
                })
            })
        }
    })

    return (
        <Card
            className='col-span-2 flex flex-col items-center justify-center min-h-[250px]'
            {...getRootProps()}
        >
            {!isUploading && !fileUrl && (
                <>
                    <Presentation className='h-10 w-10 animate-bounce' />
                    <h3 className='mt-2 text-sm font-semibold text-gray-900'>
                        Create a new meeting
                    </h3>
                    <p className='mt-1 text-center text-sm text-gray-500'>
                        Analyse your meeting with Dionysus
                        <br />
                        Powered by AI
                    </p>
                    <div className='mt-6'>
                        <Button>
                            <Upload className='ml-0.5 mr-1.5 h-5 w-5' aria-hidden="true" />
                            Upload Meeting
                            <input className='hidden' {...getInputProps()} />
                        </Button>
                    </div>
                </>
            )}
            {isUploading && (
                <div className='flex flex-col items-center justify-center'>
                    <CircularProgressbar
                        value={progress}
                        text={`${progress}%`}
                        className='mr-3 w-24 h-24'
                        styles={buildStyles({
                            pathColor: '#4caf50',
                            textColor: '#000',
                            trailColor: '#d6d6d6',
                            textSize: '16px',
                        })}
                    />
                    <p className='mt-2 text-sm text-gray-500 text-center'>
                        Uploading your meeting
                    </p>
                </div>
            )}
            {fileUrl && (
                <div className='flex flex-col items-center justify-center p-4'>
                    <h3 className='text-sm font-semibold mb-2'>File Uploaded Successfully</h3>
                    <div className='flex items-center'>
                        <input 
                            type="text" 
                            value={fileUrl} 
                            readOnly 
                            className='border rounded-l px-2 py-1 text-sm w-64'
                        />
                        <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={copyUrlToClipboard}
                            className='rounded-l-none'
                        >
                            <Copy className='h-4 w-4' />
                        </Button>
                    </div>
                </div>
            )}
        </Card>
    )
}

export default MeetingCard