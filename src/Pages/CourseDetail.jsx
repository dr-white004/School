import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  BookOpen, 
  Clock, 
  CheckCircle, 
  Play, 
  FileText, 
  HelpCircle, 
  ArrowLeft
} from "lucide-react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

const API = "https://sophisticated-eden-dr-white004-48b8c072.koyeb.app/api";
const getAuthHeaders = () => {
  const t = localStorage.getItem("accessToken");
  return { Authorization: `Bearer ${t}`, "Content-Type": "application/json" };
};

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [contents, setContents] = useState([]);
  const [enrollment, setEnrollment] = useState(null);
  const [activeContent, setActiveContent] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch course details
  const fetchCourse = async () => {
    try {
      const res = await fetch(`${API}/courses/${id}/`, { headers: getAuthHeaders() });
      const data = await res.json();
      setCourse(data);
    } catch (error) {
      console.error("Error fetching course:", error);
    }
  };

  // Fetch course contents
  const fetchContents = async () => {
    try {
      const res = await fetch(`${API}/contents/?course=${id}`, { headers: getAuthHeaders() });
      const data = await res.json();
      // Handle paginated response structure
      const contentsData = data.results || data;
      setContents(Array.isArray(contentsData) ? contentsData : []);
    } catch (error) {
      console.error("Error fetching contents:", error);
    }
  };

  // Fetch enrollment status
  const fetchEnrollment = async () => {
    try {
      const res = await fetch(`${API}/enrollments/?course=${id}`, { headers: getAuthHeaders() });
      const data = await res.json();
      // Handle paginated response structure
      const enrollmentsData = data.results || data;
      if (Array.isArray(enrollmentsData) && enrollmentsData.length > 0) {
        setEnrollment(enrollmentsData[0]);
      }
    } catch (error) {
      console.error("Error fetching enrollment:", error);
    }
  };

  // Fetch progress for a specific content item
  const fetchContentProgress = async (contentId) => {
    try {
      if (!enrollment) return null;
      
      const res = await fetch(`${API}/progress/?enrollment=${enrollment.id}&content=${contentId}`, { 
        headers: getAuthHeaders() 
      });
      const data = await res.json();
      const progressData = data.results || data;
      
      if (Array.isArray(progressData) && progressData.length > 0) {
        return progressData[0];
      }
      return null;
    } catch (error) {
      console.error("Error fetching progress:", error);
      return null;
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchCourse(), fetchContents(), fetchEnrollment()]);
      setLoading(false);
    };
    loadData();
  }, [id]);

  // Mark content as completed
  const markAsCompleted = async (contentId) => {
    try {
      if (!enrollment) return;
      
      // First check if progress already exists
      const existingProgress = await fetchContentProgress(contentId);
      
      if (existingProgress) {
        // Update existing progress
        const res = await fetch(`${API}/progress/${existingProgress.id}/`, {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify({
            ...existingProgress,
            is_completed: true,
            completed_at: new Date().toISOString()
          })
        });
        
        if (res.ok) {
          alert("Content marked as completed!");
        } else {
          alert("Error updating progress");
        }
      } else {
        // Create new progress
        const res = await fetch(`${API}/progress/`, {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify({
            enrollment: enrollment.id,
            content: contentId,
            is_completed: true,
            completed_at: new Date().toISOString()
          })
        });
        
        if (res.ok) {
          alert("Content marked as completed!");
        } else {
          alert("Error creating progress record");
        }
      }
      
      // Refresh the active content to show updated status
      if (activeContent && activeContent.id === contentId) {
        const updatedContent = { ...activeContent };
        setActiveContent(updatedContent);
      }
    } catch (error) {
      console.error("Error marking content:", error);
    }
  };

  // Check if content is completed (simplified version without progress API)
  const isContentCompleted = (contentId) => {
    // For now, we'll use a simple approach since progress API might not be working
    // In a real app, you'd check against the progress API
    return false; // Default to not completed
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Course not found</p>
      </div>
    );
  }

  if (!enrollment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>You are not enrolled in this course</p>
        <button onClick={() => navigate("/contact")} className="ml-4 text-blue-600">
          Browse Courses
        </button>
      </div>
    );
  }

  if (enrollment.status === "pending") {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Navbar />
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <Clock className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
          <h2 className="text-xl font-semibold text-yellow-800 mb-2">Waiting for Approval</h2>
          <p className="text-yellow-600 mb-4">
            Your enrollment request is pending instructor approval. 
            You'll be able to access the course content once approved.
          </p>
          <button 
            onClick={() => navigate("/courses")}
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
          >
            Browse Other Courses
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  if (enrollment.status === "rejected") {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Navbar />
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <HelpCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-xl font-semibold text-red-800 mb-2">Enrollment Rejected</h2>
          <p className="text-red-600 mb-4">
            Your enrollment request was not approved. Please contact the instructor for more information.
          </p>
          <button 
            onClick={() => navigate("/courses")}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Browse Other Courses
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  // Calculate overall progress (simplified)
  const totalContents = contents.length;
  const completionPercentage = enrollment.completion_percentage || 0;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Navbar />
      
      {/* Header */}
      <div className="mb-6">
        <button 
          onClick={() => navigate("/courses")}
          className="flex items-center text-blue-600 mb-4"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Courses
        </button>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">{course.title}</h1>
            <p className="text-gray-600">{course.description}</p>
            <p className="text-sm text-gray-500 mt-2">
              Instructor: {course.instructor_name || "Unknown Instructor"}
            </p>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-4 min-w-[200px]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Progress</span>
              <span className="text-sm font-bold">{completionPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {Math.round((completionPercentage / 100) * totalContents)} of {totalContents} items completed
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Content List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              <BookOpen size={20} />
              Course Content
            </h2>
            
            <div className="space-y-2">
              {contents.length === 0 ? (
                <p className="text-gray-500 text-sm">No content available yet.</p>
              ) : (
                contents.map((content) => {
                  const isCompleted = isContentCompleted(content.id);
                  const Icon = getContentIcon(content.content_type);
                  
                  return (
                    <div
                      key={content.id}
                      className={`p-3 rounded cursor-pointer border ${
                        activeContent?.id === content.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                      onClick={() => setActiveContent(content)}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded ${
                          isCompleted ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-600"
                        }`}>
                          <Icon size={16} />
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="font-medium text-sm">{content.title}</h3>
                          <p className="text-xs text-gray-500 capitalize">
                            {content.content_type}
                          </p>
                        </div>
                        
                        {isCompleted && (
                          <CheckCircle size={16} className="text-green-500" />
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Content Viewer */}
        <div className="lg:col-span-2">
          {activeContent ? (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded bg-blue-100 text-blue-600">
                  {React.createElement(getContentIcon(activeContent.content_type), { size: 20 })}
                </div>
                <h2 className="text-xl font-semibold">{activeContent.title}</h2>
              </div>
              
              <p className="text-gray-600 mb-6">{activeContent.description}</p>
              
              {/* Content Display based on type */}
              {activeContent.content_file ? (
                <div className="mb-6">
                  {activeContent.content_type === 'video' ? (
                    <div className="relative aspect-video">
                      <video 
                        controls 
                        className="w-full h-full rounded-lg"
                        src={activeContent.content_file}
                      >
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  ) : (
                    <div className="border rounded-lg p-4">
                      <a 
                        href={activeContent.content_file} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline flex items-center gap-2"
                      >
                        <FileText size={16} />
                        Download {activeContent.content_type}
                      </a>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <p className="text-yellow-800">No file available for this content.</p>
                </div>
              )}
              
              {/* Mark as completed button */}
              {!isContentCompleted(activeContent.id) && (
                <button
                  onClick={() => markAsCompleted(activeContent.id)}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-2"
                >
                  <CheckCircle size={16} />
                  Mark as Completed
                </button>
              )}
              
              {isContentCompleted(activeContent.id) && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-green-800">
                    <CheckCircle size={16} />
                    <span>Completed</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select Content</h3>
              <p className="text-gray-500">Choose an item from the course content list to get started.</p>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

// Helper function to get icon based on content type
function getContentIcon(contentType) {
  switch (contentType) {
    case 'video':
      return Play;
    case 'document':
      return FileText;
    case 'quiz':
      return HelpCircle;
    case 'assignment':
      return FileText; // Using FileText as fallback
    default:
      return FileText;
  }
}