import React, { useState, useEffect } from "react";
import { AreaChart, Card, DonutChart, BarChart } from "@tremor/react";
import { Filter, Sliders, SortAsc } from "lucide-react";

import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const Dashboard = () => {
  const colRef = collection(db, "issue");
  const [complaintArr, setComplaintArr] = useState([]);
  const [ration, setRation] = useState(null);

  const countStatus = (setComplaintArr) => {
    let newPositive = 0;
    let newNegative = 0;
    for (let i = 0; i < setComplaintArr.length; i++) {
      if (setComplaintArr[i].status === true) {
        newPositive += 1;
      } else {
        newNegative += 1;
      }
    }
    return { newPositive, newNegative };
  };
  const { newPositive, newNegative } = countStatus(complaintArr);

  const countCategory = (setComplaintArr) => {
    let newBiological = 0;
    let newNatural = 0;
    let newEnvironmental = 0;
    let newHumanInduced = 0;
    let newTechnological = 0;
    for (let i = 0; i < setComplaintArr.length; i++) {
      if (
        setComplaintArr[i].type === "Biological Disasters" ||
        setComplaintArr[i].type === "fnsyV6Ze7Ufhkxcqnq20"
      ) {
        newBiological += 1;
      } else if (
        setComplaintArr[i].type === "Natural Disasters" ||
        setComplaintArr[i].type === "YU3EJbpcs7lTo7Pqbgow"
      ) {
        newNatural += 1;
      } else if (
        setComplaintArr[i].type === "Environmental Disasters" ||
        setComplaintArr[i].type === "iIntcTRGv0z8mIRXvYtL"
      ) {
        newEnvironmental += 1;
      } else if (
        setComplaintArr[i].type === "Technological Disasters" ||
        setComplaintArr[i].type === "Ang7eN63LnIbkKPTcPvx"
      ) {
        newTechnological += 1;
      } else {
        newHumanInduced += 1;
      }
    }
    return { newBiological, newEnvironmental, newTechnological, newNatural, newHumanInduced };
  };
  const { newBiological, newEnvironmental, newTechnological, newNatural, newHumanInduced } =
    countCategory(complaintArr);

  const countLoc = (setComplaintArr) => {
    let Nalla = 0;
    let NallaSolved = 0;
    let Malad = 0;
    let MaladSolved = 0;
    let Andheri = 0;
    let AndheriSolved = 0;
    let Others = 0;
    let OthersSolved = 0;
    let Total = 0;
    for (let i = 0; i < setComplaintArr.length; i++) {
      if (setComplaintArr[i].location === "Nallasopara") {
        Nalla += 1;
        Total += 1;
        if (setComplaintArr[i].status === true) {
          NallaSolved += 1;
        }
      } else if (setComplaintArr[i].location === "Malad") {
        Malad += 1;
        Total += 1;
        if (setComplaintArr[i].status === true) {
          MaladSolved += 1;
        }
      } else if (setComplaintArr[i].location === "Andheri") {
        Andheri += 1;
        Total += 1;
        if (setComplaintArr[i].status === true) {
          AndheriSolved += 1;
        }
      } else {
        Others += 1;
        Total += 1;
        if (setComplaintArr[i].status === true) {
          OthersSolved += 1;
        }
      }
    }
    return {
      Nalla,
      Malad,
      Andheri,
      Others,
      Total,
      NallaSolved,
      MaladSolved,
      AndheriSolved,
      OthersSolved,
    };
  };
  const {
    Nalla,
    Malad,
    Andheri,
    Others,
    Total,
    NallaSolved,
    MaladSolved,
    AndheriSolved,
    OthersSolved,
  } = countLoc(complaintArr);

  useEffect(() => {
    getDocs(colRef)
      .then((snapshot) => {
        let issues = [];
        snapshot.docs.forEach((doc) => {
          issues.push({ ...doc.data(), id: doc.id });
        });
        setComplaintArr(issues);
        // console.log(issues);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  const categoryStat = [
    {
      name: "Bio.",
      "Category Count": newBiological,
    },
    {
      name: "Natural",
      "Category Count": newNatural,
    },
    {
      name: "Env.",
      "Category Count": newEnvironmental,
    },
    {
      name: "Tech.",
      "Category Count": newTechnological,
    },
    {
      name: "Human-Induced",
      "Category Count": newHumanInduced,
    },
  ];

  const StatusRatio = [
    {
      name: "Solved Issues",
      count: newPositive,
    },
    {
      name: "Unsolved Issues",
      count: newNegative,
    },
  ];

  const [value, setValue] = useState(null);

  const LocSolved = [
    {
      location: "Nallasopara",
      Disasters: Nalla,
      "Solved Disasters": NallaSolved,
    },
    {
      location: "Malad",
      Disasters: Malad,
      "Solved Disasters": MaladSolved,
    },
    {
      location: "Andheri",
      Disasters: Andheri,
      "Solved Disasters": AndheriSolved,
    },
    {
      location: "Others",
      Disasters: Others,
      "Solved Disasters": OthersSolved,
    },
  ];

  let newRat;

  useEffect(() => {
    const ratio = () => {
      // Assuming newPositive and Total are defined elsewhere
      newRat = (newPositive / Total).toFixed(2) * 100;
      setRation(newRat);
    };

    // Delay the execution of ratio() by 200ms
    const timeoutId = setTimeout(() => {
      ratio();
    }, 100);

    // Clear the timeout if component unmounts or dependency changes
    return () => clearTimeout(timeoutId);
  }, [newPositive, Total]); // Use newPositive and Total as dependencies

  const valueFormatter = function (number) {
    return new Intl.NumberFormat("us").format(number).toString();
  };
  const dataFormatter = (number) =>
    Intl.NumberFormat("us").format(number).toString();

  return (
    <div className="md:w-[90%] w-[95%] mx-auto py-3">
      <div className="grid md:grid-cols-4 gap-3">
        <div className="col-span-3">
          <div className="grid md:grid-cols-3 gap-3 mb-3 ">
            <Card className="mx-auto" decorationColor="indigo">
              <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
                Disasters in Nallasopara Region
              </p>
              <p className="text-3xl text-tremor-content-strong dark:text-dark-tremor-content-strong font-semibold">
                {Nalla} / {Total}
              </p>
            </Card>
            <Card className="mx-auto" decorationColor="indigo">
              <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
                Disasters in Malad Region
              </p>
              <p className="text-3xl text-tremor-content-strong dark:text-dark-tremor-content-strong font-semibold">
                {Malad} / {Total}
              </p>
            </Card>
            <Card className="mx-auto" decorationColor="indigo">
              <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
                Disasters in Andheri Region
              </p>
              <p className="text-3xl text-tremor-content-strong dark:text-dark-tremor-content-strong font-semibold">
                {Andheri} / {Total}
              </p>
            </Card>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            <Card>
              <h3 className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
                Disaster Tracker
              </h3>
              <p className="text-tremor-metric text-tremor-content-strong dark:text-dark-tremor-content-strong font-semibold">
                {Total}
              </p>
              <AreaChart
                className="mt-4 h-72"
                data={LocSolved}
                index="location"
                yAxisWidth={60}
                categories={["Disasters", "Solved Disasters"]}
                colors={["indigo", "cyan"]}
                valueFormatter={valueFormatter}
              />
            </Card>
            <Card>
              <h3 className="text-lg font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                Category based Disasters faced by the People
              </h3>
              <BarChart
                className="mt-6"
                data={categoryStat}
                index="name"
                categories={["Category Count"]}
                colors={["blue"]}
                valueFormatter={dataFormatter}
                yAxisWidth={48}
              />
            </Card>
          </div>
        </div>
        <div className="grid gap-3">
          <Card className="mx-auto" decorationColor="indigo">
            <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
              Problem Solving Ratio
            </p>
            <p className="text-3xl mb-4 text-tremor-content-strong dark:text-dark-tremor-content-strong font-semibold">
              {ration}%
            </p>
            <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
              This is the ratio of the number of disasters solved to the total
              number of disasters
            </p>
          </Card>
          <Card className="h-full">
            <h3 className="text-lg font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
              Completion Ratio
            </h3>
            <h3 className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
              Ratio of the no. of disasters/ the no. of disasters recieved by
              the government
            </h3>
            <DonutChart
              data={StatusRatio}
              className="mt-4 h-[11rem]"
              category="count"
              index="name"
              valueFormatter={valueFormatter}
              colors={["blue", "cyan"]}
              onValueChange={(v) => setValue(v)}
            />
          </Card>
        </div>
        {/* <div className="flex flex-col gap-3">
          <Card className="mx-auto" decorationColor="indigo">
            <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
              Sales
            </p>
            <p className="text-3xl text-tremor-content-strong dark:text-dark-tremor-content-strong font-semibold">
              $34,743
            </p>
          </Card>
          <Card className="h-full">
            <h3 className="text-lg font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
              Number of species threatened with extinction (2021)
            </h3>
            <h3 className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
              Newsletter Revenue
            </h3>
            <DonutChart
              data={sales}
              className="mt-4 h-[11rem]"
              category="sales"
              index="name"
              valueFormatter={valueFormatter}
              colors={["blue", "cyan", "indigo", "violet", "fuchsia"]}
              onValueChange={(v) => setValue(v)}
            />
          </Card>
        </div>

        <div className="flex flex-col gap-3">
          <Card className="mx-auto" decorationColor="indigo">
            <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
              Sales
            </p>
            <p className="text-3xl text-tremor-content-strong dark:text-dark-tremor-content-strong font-semibold">
              $34,743
            </p>
          </Card>
          <Card className="h-full">
            <h3 className="text-lg font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
              Number of species threatened with extinction (2021)
            </h3>
            <h3 className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
              Newsletter Revenue
            </h3>
            <DonutChart
              data={sales}
              className="mt-4 h-[11rem]"
              category="sales"
              index="name"
              valueFormatter={valueFormatter}
              colors={["blue", "cyan", "indigo", "violet", "fuchsia"]}
              onValueChange={(v) => setValue(v)}
            />
          </Card>
        </div> */}
      </div>
      <a href="/disasters">
        <Card className="my-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
              Disaster List
            </h3>
          </div>
          <table role="list" className="w-full divide-y divide-gray-200">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="max-w-6 md:px-6 md:flex hidden px-2 py-3"
                >
                  User
                </th>
                <th scope="col" className="md:px-6 px-2 py-3">
                  Disaster
                </th>
                <th
                  scope="col"
                  className="text-start md:block hidden px-6 py-3"
                >
                  Location
                </th>
                <th
                  scope="col"
                  className="md:text-start text-end md:px-6 px-2 py-3"
                >
                  Status
                </th>
              </tr>
            </thead>
            {complaintArr &&
              complaintArr.map((values, i) => {
                return (
                  <tr key={i} className="w-full bg-white border-b">
                    <td
                      scope="row"
                      className="max-w-4 md:px-6 px-2 py-4 md:flex hidden font-medium text-gray-900 whitespace-nowrap"
                    >
                      <div className="flex-shrink-0">
                        <img
                          className="w-8 h-8 rounded-full"
                          src="/user.jpg"
                          alt={values.owner}
                        />
                      </div>
                    </td>
                    <th className="md:px-6 px-0 py-4">
                      <div className="flex-1 min-w-0 ms-4">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {values.title}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {values.owner}
                        </p>
                      </div>
                    </th>
                    <td className="w-10 text-start md:block hidden px-6 py-4">
                      <div className="md:inline-flex items-center text-base font-semibold text-gray-900">
                        {values.location}
                      </div>
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm ${
                        values.status ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {values.status ? "Solved" : "Pending"}
                    </td>
                  </tr>
                );
              })}
          </table>
        </Card>
      </a>
    </div>
  );
};

export default Dashboard;
