import axios from "axios";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useUserStore } from "../../store/UserStore";

import JobDetailView from "../../components/Job/JobDetailView";
import JobsListView from "../../components/Job/JobListView";
import { useApplicationStore } from "../../store/ApplicationStore";
import { useJobStore } from "../../store/JobStore";

const Explore = () => {
  const naviagte = useNavigate();

  const updateName = useUserStore((state) => state.updateName);
  const updateAddress = useUserStore((state) => state.updateAddress);
  const updateRole = useUserStore((state) => state.updateRole);
  const updateDob = useUserStore((state) => state.updateDob);
  const updateSkills = useUserStore((state) => state.updateSkills);
  const updatePhonenumber = useUserStore((state) => state.updatePhonenumber);
  const updateId = useUserStore((state) => state.updateId);
  const updateAvailability = useUserStore((state) => state.updateAvailability);
  const updateGender = useUserStore((state) => state.updateGender);
  const updateHours = useUserStore((state) => state.updateHours);
  const updateIsLoggedIn = useUserStore((state) => state.updateIsLoggedIn);

  const updateApplicationList = useApplicationStore(
    (state) => state.updateApplicationList
  );
  // const userId = useUserStore((state) => state.id);

  // const [displayList, setDisplayList] = useState<Job[]>([]);

  const updateEmail = useUserStore((state) => state.updateEmail);

  const updateJobList = useJobStore((state) => state.updateJobList);
  const jobList: Job[] = useJobStore((state) => state.jobList);
  // const applicationList = useApplicationStore((state) => state.applicationList);

  useEffect(() => {
    const token: string = localStorage.getItem("token")!;
    if (!!!token) {
      naviagte("/login");
    }
    if (!!token) {
      const tokenInfo = token.split(".");
      const userInfo = JSON.parse(atob(tokenInfo[1]));

      updateName(userInfo.name);
      updateEmail(userInfo.email);
      updateAddress(userInfo.address);
      updateRole(userInfo.role);
      updateDob(userInfo.dob);
      updateSkills(userInfo.skills);
      updatePhonenumber(userInfo.phonenumber);
      updateId(userInfo._id);
      updateAvailability(userInfo.availability);
      updateGender(userInfo.gender);
      updateHours(userInfo.hours);
      updateIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    axios
      .get("http://ec2-18-118-238-67.us-east-2.compute.amazonaws.com:8000/api/v1/users/fetchapplications" , {
        headers:{
          Authorization:localStorage.getItem('token')
        }
      })
      .then((res) => {
        if (res.status !== 200) {
          toast.error("Error fetching applications");
          return;
        }
        updateApplicationList(res.data.application as Application[]);
      });

    axios
      .get("http://ec2-18-118-238-67.us-east-2.compute.amazonaws.com:8000/api/v1/users/getJobs", {
        params: { page: 1, limit: 25 },
        headers:{
          Authorization:localStorage.getItem('token')
        }
      })
      .then((res) => {
        if (res.status !== 200) {
          toast.error("Error fetching jobs");
          return;
        }
        updateJobList(res.data.jobs as Job[]);
      });
  }, []);

  return (
    <>
      <div className="content bg-slate-50">
        <div className="flex flex-row" style={{ height: "calc(100vh - 72px)" }}>
          <JobsListView jobsList={jobList} />
          <JobDetailView />
        </div>
      </div>
    </>
  );
};

export default Explore;
