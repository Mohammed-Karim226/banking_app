"use client";
import { useEffect, useState } from "react";
import {
  FileText,
  CheckCircle,
  AlertCircle,
  Trash2,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { TCreateIssue, TErrorResponse } from "@/src/types";
import { deleteIssue } from "@/src/utils/actions/user.actions";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

import Lottie from "lottie-react";
import issue from "./Lottie/issue.json";

const ReportIssues = ({ issues }: { issues: TCreateIssue[] }) => {
  const [issuesData, setIssuesData] = useState<TCreateIssue[]>([]);
  const router = useRouter();
  const handleDelete = async (id: string) => {
    try {
      toast.success(`${(await deleteIssue({ id })).message}`, {
        position: "bottom-right",
      });
      router.refresh();
    } catch (error) {
      const err = error as TErrorResponse;
      toast.error(err.message, {
        position: "bottom-right",
      });
    }
  };

  useEffect(() => {
    setIssuesData(issues);
  }, [issues]);

  return (
    <div className="p-6 flex max-sm:p-2 flex-col gap-4 overflow-auto">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        Reported Issues
      </h2>

      {issuesData.length > 0 ? (
        issuesData.map((issue, index) => (
          <div
            key={issue.id}
            className="bg-white dark:bg-gray-800 rounded-md shadow-md border-l-4 border-yellow-500 p-6 mb-6"
          >
            <div className="flex justify-between max-sm:flex-col max-sm:justify-start max-sm:gap-2 items-start mb-4">
              <div className="flex items-center">
                <span className="text-xl font-bold text-gray-900 dark:text-gray-100 mr-4">
                  {index + 1}
                </span>
                <div className="text-lg font-medium text-gray-700 dark:text-gray-300">
                  {issue.subject}
                </div>
              </div>

              <div className="flex space-x-2">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-blue-500 mr-1 animate-pulse" />
                  <span className="text-sm text-blue-500">Pending Review</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-purple-500 mr-1" />
                  <span className="text-sm text-purple-500">
                    Pending Approval
                  </span>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="default">
                      <MoreHorizontal className="h-5 w-5 text-gray-500 cursor-pointer" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-24 h-8 flex justify-center items-center bg-white">
                    <DropdownMenuItem>
                      <Button
                        variant="default"
                        className="flex text-base text-red-500 justify-center items-center gap-2"
                        onClick={() => handleDelete(issue.id ?? "")}
                      >
                        <Trash2 size={18} color="red" /> Delete
                      </Button>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="font-semibold text-gray-700 dark:text-gray-300">
                Root Cause
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong>Reason for Nonconformance:</strong> {issue.description}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong>Nonconformance Impact:</strong> Nonconformance to
                training SOP leading to potential impact to product.
              </p>
            </div>

            <div className="mb-4">
              <h3 className="font-semibold text-gray-700 dark:text-gray-300">
                Document
              </h3>
              <div className="flex items-center space-x-4">
                <FileText className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Standard Operating Procedure
                  </p>
                  <div className="flex space-x-2">
                    <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded">
                      V2 REVIEWED
                    </span>
                    <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">
                      V1 APPROVED
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-700 dark:text-gray-300">
                  Priority
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Medium
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 dark:text-gray-300">
                  Risk Level
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Low</p>
              </div>
            </div>

            <Button className="bg-yellow-500 max-sm:w-full text-white hover:bg-yellow-600 w-full mr-2 max-sm:mr-0">
              Move to Immediate Action
            </Button>
          </div>
        ))
      ) : (
        <div className="flex overflow-hidden h-fit justify-center items-center flex-col gap-2">
          <Lottie animationData={issue} loop={true} className="h-3/4" />
          <p className="text-gray-600 dark:text-gray-200 text-lg font-semibold text-center">
            🌟 No issues reported yet! 🌟
          </p>
        </div>
      )}
    </div>
  );
};

export default ReportIssues;
