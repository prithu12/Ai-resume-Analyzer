import Navbar from "~/components/Navbar";
import React from "react";
import { prepareInstructions } from  "~/constants/index";
import { generateUUID } from "~/lib/utils";
import { convertPdfToImage } from "~/lib/pdf2img";
import FileUploader from "~/components/FileUploader";
import type { FormEvent } from "react";
import { usePuterStore } from "~/lib/puter";
const Upload = () => {
    const {auth,fs,ai,kv}=usePuterStore();
    const[isProcessing,setIsProcessing]=React.useState(false);
    const[statusText,setStatusText]=React.useState("");
    const [file, setFile] =React.useState<File | null>(null);

    const handleFileSelect = (file: File | null) => {
        setFile(file)
    }
    const handleAnalysis=async({companyName,jobTitle,jobDescription , file}:{companyName:string, jobTitle:string , jobDescription:string ,file: File})=>{
        setIsProcessing(true);
        setStatusText("Uploading your resume...");
        const uploadedFile=await fs.upload([file]);
        if(!uploadedFile){
            return setStatusText("Failed to upload file. Please try again.");
        }
        setStatusText("Converting into image...");
        const imagefile = await convertPdfToImage(file);
        console.log("Image conversion result:", imagefile);

        if (!imagefile.file) {
            console.error("PDF → Image failed:", imagefile.error);
            return setStatusText("Failed to convert PDF to image. Please try again.");
        }

        setStatusText("Uploading the image...");
        const uploadedImage=await fs.upload([imagefile.file]);
        if(!uploadedImage){
            return setStatusText("Failed to upload file. Please try again.");
        }
        setStatusText("Preparing data...");
        const uuid=generateUUID();
        const data={
            id:uuid,
            resumePath:uploadedFile.path,
            imagePath:uploadedImage.path,
            companyName,
            jobTitle,
            jobDescription,
            feedback:'',
        }
        await kv.set(`resume-${uuid}`,JSON.stringify(data));
        setStatusText("Analyzing your resume...");
        const feedback=await ai.feedback(
            uploadedFile.path,
            prepareInstructions ({ jobTitle , jobDescription})
        )
        if(!feedback){
            return setStatusText("Failed to analyze resume. Please try again.");
        }
        const feedbackText=typeof feedback.message.content==='string'?feedback.message.content:feedback.message.content[0].text;
        data.feedback=JSON.parse(feedbackText);
        await kv.set(`resume:${uuid}`,JSON.stringify(data));
        setStatusText("Analysis complete! Redirecting...");
        console.log(data);

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
        handleAnalysis({companyName,jobTitle,jobDescription,file});
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
                            <FileUploader file={file} onFileSelect={handleFileSelect} />
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