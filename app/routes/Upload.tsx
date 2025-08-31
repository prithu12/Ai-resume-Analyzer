import Navbar from "~/components/Navbar";
import React from "react";

import FileUploader from "~/components/FileUploader";
import type { FormEvent } from "react";
import { usePuterStore } from "~/lib/puter";
const Upload = () => {
    const[isProcessing,setIsProcessing]=React.useState(false);
    const[statusText,setStatusText]=React.useState("");
    const [file, setFile] =React.useState<File | null>(null);

    const handleFileSelect = (file: File | null) => {
        setFile(file)
    }
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget.closest('form');
        if(!form) return;
        const formData = new FormData(form);

        const companyName = formData.get('company-name') as string;
        const jobTitle = formData.get('job-title') as string;
        const jobDescription = formData.get('job-description') as string;

        if(!file) return;
    }
  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
        <Navbar></Navbar>
        <section className="main-section">
            <div className="page-heading py-16">
                <h1>Smart feedback for your dream</h1>
                {isProcessing ?(
                <>
                    <h2>{statusText}</h2>
                    <img src="/images/resume-scan.gif" className="w-fit"></img>
                </>
                ):(
                    <h2>Drop your Resume for an ATS score and improvement tips</h2>
                )}
                {!isProcessing && (
                    <form id="upload-forms" className="flex flex-col gap-4 mt-8 " onSubmit={handleSubmit}>
                        <div className="form-div">
                            <label htmlFor="company-name" >Company Name</label>
                            <input type="text" id="company-name" name="company-name" className="company-name" />
                        </div>
                        <div className="form-div">
                            <label htmlFor="job-title" >Job Title</label>
                            <input type="text" id="company-name" name="job-title" className="job-title" />
                        </div>
                        <div className="form-div">
                            <label htmlFor="job-description" >Job-Description</label>
                            <textarea rows={5} id="job-description" name="job-description" className="job-description"  />
                        </div>
                        <div className="form-div">
                            <label htmlFor="uploader" >Upload Resume</label>
                            <FileUploader/>
                        </div>
                        <button className="primary-button" type="submit">Analyze Resume</button>
                    </form>
                )}
            </div>

        </section>
    </main>
  )
}

export default Upload