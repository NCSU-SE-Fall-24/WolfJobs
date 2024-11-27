import { useEffect, useState } from "react";
import { HiOutlineArrowRight, HiOutlineBookmark } from "react-icons/hi";
import { useSearchParams } from "react-router-dom";
import { useApplicationStore } from "../../store/ApplicationStore";
import { useUserStore } from "../../store/UserStore";
import { toast } from "react-toastify";
import axios from "axios";
import { saveJobURL } from "../../api/constants";

interface Job {
  _id: string;
  type?: string; // Optional type property to prevent errors
  managerAffilication?: string;
  name: string;
  status: string;
  pay?: string;
}

interface Application {
  jobid: string;
  applicantid: string;
  status: string;
}

// Helper function to get affiliation tag
const getAffiliationTag = (tag?: string): string => {
  return tag ? tag.split("-").join(" ").toUpperCase() : "NC STATE DINING";
};

const JobListTile = ({ data }: { data: Job }) => {
  const [active, setActive] = useState<boolean>(false);
  const [application, setApplication] = useState<Application | null>(null);
  const [isJobSaved, setIsJobSaved] = useState<boolean>(false); // Added state for saved job
  const [searchParams, setSearchParams] = useSearchParams();

  const userId = useUserStore((state) => state.id);
  const userRole = useUserStore((state) => state.role);
  
  const applicationList = useApplicationStore((state) => state.applicationList);

  // Find application for the current job and user
  useEffect(() => {
    const temp = applicationList.find(
      (item) => item.jobid === data._id && item.applicantid === userId
    );
    setApplication(temp || null);
  }, [data, applicationList, userId]);

  // Check if the job is saved in local storage
  useEffect(() => {
    const savedJobs = JSON.parse(localStorage.getItem("savedJobs") || "[]");
    const jobExists = savedJobs.some((job: Job) => job._id === data._id);
    setIsJobSaved(jobExists);
  }, [data]);

  // Set active job based on search params
  useEffect(() => {
    const id = searchParams.get("jobId");
    setActive(data._id === id);
  }, [searchParams, data._id]);

  // Handle click event to set active job
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setSearchParams({ jobId: data._id });
  };

  // Get affiliation color based on tag
  const getAffiliationColour = (tag?: string) => {
    switch (tag) {
      case "nc-state-dining":
        return "bg-[#FF2A2A]/10";
      case "campus-enterprises":
        return "bg-[#91B0FF]/10";
      case "wolfpack-outfitters":
        return "bg-[#FBD71E]/10";
      default:
        return "bg-[#FF2A2A]/10";
    }
  };

  // Handle saving or unsaving a job
  const handleSaveJob = async (e: any) => {
    e.stopPropagation();
    try {
      if (isJobSaved) {
        // Unsave job
        await axios.delete(saveJobURL, { data: { jobId: data._id, userId } });
        setIsJobSaved(false);
        toast.info("Job unsaved.");
      } else {
        // Save job
        await axios.post(saveJobURL, { jobId: data._id, userId });
        setIsJobSaved(true);
        toast.success("Job saved successfully!");
      }
    } catch (error) {
      console.error("Error saving job:", error);
      toast.error("Failed to save job.");
    }
  };

  return (
    <div className="my-3" onClick={handleClick}>
      <div className={`p-3 bg-white rounded-xl shadow-sm ${active ? "border-black" : "border-white"} border`}>
        <div className="flex flex-row">
          <div className="w-4/6">
            <div className={`w-fit ${getAffiliationColour(data.managerAffilication)} rounded-2xl px-3 py-0`}>
              <p className="inline text-xs">{getAffiliationTag(data.managerAffilication)}</p>
            </div>
            <div className="h-1"></div>
            <div className="pl-2">
              <p className="text-base">
                <b>Role:</b> {data.name}
              </p>
              <p className="text-base">
                <b>Job Status:</b>
                <span className={`${data.status === "closed" ? "text-[#FF5353]" : ""}`}>
                  &nbsp;<span className="capitalize">{data.status}</span>
                </span>
              </p>
              {/* Fixing split error by adding fallback */}
              <p className="text-base">
                <b>Type:</b> <span className="capitalize">{data.type?.split("-").join(" ") || "Unknown Type"}</span>
              </p>
              {userRole === "Applicant" && (
                <p className="text-base">
                  <b>Application Status:</b>&nbsp;
                  {application?.status === "accepted" || application?.status === "rejected"
                    ? application?.status
                    : '"In Review"'}
                </p>
              )}
            </div>
          </div>

          <div className="w-2/6 flex flex-col-reverse text-right">
            {/* Action buttons */}
            {/* Add action button logic here if needed */}
            <p className="text-3xl">{data.pay || "0"}$/hr</p>

            {/* Save/Unsave button */}
            <button 
              className="ml-4 inline-flex items-center text-black cursor-pointer"
              onClick={handleSaveJob}
            >
              <HiOutlineBookmark className="mr-1 text-2xl" />
              <span>{isJobSaved ? "Unsave Job" : "Save Job"}</span>
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default JobListTile;