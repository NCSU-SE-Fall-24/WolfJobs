import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { MemoryRouter } from "react-router";
import Explore from "../../../src/Pages/Explore/Explore";

const mock = new MockAdapter(axios);

describe("Explore", () => {
  beforeEach(() => {
    // Clear prior mocks and configurations
    mock.reset();
  });

  test("Request for users by jobs", async () => {
    mock.onGet("http://ec2-18-118-238-67.us-east-2.compute.amazonaws.com:8000/api/v1/users").reply(200, {
      jobs: [
        { _id: "1", title: "Job 1" },
        { _id: "2", title: "Job 2" },
      ],
    });
    <MemoryRouter>
      render(
      <Explore />
      );
    </MemoryRouter>;
  });
  test("Request for applications", async () => {
    // Mock successful API response for fetching applications
    mock
      .onGet("http://ec2-18-118-238-67.us-east-2.compute.amazonaws.com:8000/api/v1/users/fetchapplications")
      .reply(200, {
        application: [{ _id: "1", jobid: "123", status: "applied" }],
      });

    <MemoryRouter>
      render(
      <Explore />
      );
    </MemoryRouter>;
  });
});
