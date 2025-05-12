import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { 
  FiUser, FiBook, FiDollarSign, 
  FiCheckCircle, FiXCircle, FiClock,
  FiCalendar, FiCreditCard, FiPackage
} from "react-icons/fi";
import "./QRView.css";
import i18n from "../i18n";

const QRView = () => {
  const { userId, courseId, formId } = useParams();
  const [qrDetails, setQrDetails] = useState(null);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [fullName, setFullName] = useState("");
  const [courseName, setCourseName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [image, setImage] = useState();
  const [activeTab, setActiveTab] = useState("overview");
  const token = localStorage.getItem("token");
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const { t } = useTranslation();

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!token) {
      navigate("/", { replace: true });
    }
  }, [token, navigate]);

  useEffect(() => {
    if (location.state?.autoReturn) {
      const timer = setTimeout(() => {
        navigate("/qrscanner");
      }, 5000); // 5 seconds (or any time you want)
      return () => clearTimeout(timer);
    }
  }, [navigate, location]);

  useEffect(() => {
    let imageUrl; // Hold the blob URL for cleanup
  
    const fetchData = async () => {
      try {
        if (userId && courseId) {
          // Fetch user data
          const userResponse = await axios.get(`${baseUrl}/api/user/getqrDetails/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
  
          const user = userResponse.data;
          const course = user?.courses?.find((c) => c.courseId === courseId);
  
          if (course?.payments?.length > 0) {
            setPaymentInfo(course.payments[0]);
          }
  
          // Fetch course name
          const lang = localStorage.getItem("dashboardLang") || "en";
          try {
            const courseResponse = await axios.get(`${baseUrl}/api/courses/${courseId}/getName`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
  
            const courseTitle = lang === "ru"
              ? courseResponse.data.nameRussian
              : courseResponse.data.name;
  
            setCourseName(courseTitle || "");
          } catch (courseError) {
            console.error("Error fetching course name:", courseError);
            setCourseName("");
          }
  
          const pd = user?.personalDetails;
          const name = pd
            ? `${pd.title || ""} ${pd.firstName || ""} ${pd.middleName || ""} ${pd.lastName || ""}`
                .replace(/\s+/g, " ")
                .trim()
            : user.name || "Unnamed User";
  
          setFullName(name);
          setQrDetails({ user, course });
  
          // Fetch user image if email exists
          if (user.email) {
            try {
              const imageResponse = await fetch(`${baseUrl}/api/user/image/${user.email}`);
              if (imageResponse.ok) {
                const imageBlob = await imageResponse.blob();
                imageUrl = URL.createObjectURL(imageBlob);
                setImage(imageUrl);
              }
            } catch (imageError) {
              console.error("Error fetching user image:", imageError);
            }
          }
        }
      } catch (err) {
        console.error("Error fetching QR details:", err);
        setError("Failed to load user data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [userId, courseId, baseUrl, token]);  // ✅ image removed
  
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-animation">
          <div className="loading-spinner"></div>
          <p>{t("verification.loading")}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-card">
          <div className="error-icon">
            <FiXCircle />
          </div>
          <h2>{t("verification.failed")}</h2>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="retry-btn"
          >
            {t("verification.retry")}
          </button>
        </div>
      </div>
    );
  }

  const StatusPill = ({ status }) => {
    const statusMap = {
      paid: { color: "var(--success)", icon: <FiCheckCircle /> },
      pending: { color: "var(--warning)", icon: <FiClock /> },
      default: { color: "var(--error)", icon: <FiXCircle /> }
    };
    
    const currentStatus = statusMap[status?.toLowerCase()] || statusMap.default;
    
    return (
      <span 
        className="status-pill"
        style={{ backgroundColor: `${currentStatus.color}20`, color: currentStatus.color }}
      >
        {currentStatus.icon}
        <span>{status}</span>
      </span>
    );
  };

  return (
    <div className="verification-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <h1>{t("verification.title")}</h1>
        </div>
      </header>

      {/* Profile Card */}
      <section className="profile-card">
  <div className="avatar">
    {image ? (
      <img 
        src={image} 
        alt={fullName} 
        className="avatar-image"
        onError={(e) => {
          // If image fails to load, show the icon instead
          e.currentTarget.style.display = 'none';
        }}
      />
    ) : (
      <FiUser className="avatar-icon" />
    )}
  </div>
  <div className="profile-info">
    <h2>{fullName}</h2>
    {qrDetails?.user?.email && (
      <p className="member-id">{qrDetails.user.email}</p>
    )}
  </div>
</section>

      {/* Navigation Tabs */}
      <nav className="dashboard-tabs">
        <button 
          className={`tab-btn ${activeTab === "overview" ? "active" : ""}`}
          onClick={() => setActiveTab("overview")}
        >
          {t("verification.tabs.overview")}
        </button>
        <button 
          className={`tab-btn ${activeTab === "course" ? "active" : ""}`}
          onClick={() => setActiveTab("course")}
        >
          {t("verification.tabs.course")}
        </button>
        <button 
          className={`tab-btn ${activeTab === "payment" ? "active" : ""}`}
          onClick={() => setActiveTab("payment")}
        >
          {t("verification.tabs.payment")}
        </button>
      </nav>

      {/* Tab Content */}
      <main className="dashboard-content">
        {activeTab === "overview" && (
          <div className="overview-grid">
            <div className="overview-card">
              <div className="card-header">
                <FiBook />
                <h3>{t("verification.overview.courseDetails")}</h3>
              </div>
              <div className="card-body">
                {courseName && (
                  <div className="info-row">
                    <span>{t("verification.overview.courseName")}:</span>
                    <span>{courseName}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="overview-card">
              <div className="card-header">
                <FiDollarSign />
                <h3>{t("verification.overview.paymentStatus")}</h3>
              </div>
              <div className="card-body">
                {paymentInfo ? (
                  <>
                    <div className="info-row">
                      <span>{t("verification.overview.status")}:</span>
                      <StatusPill status={paymentInfo.status} />
                    </div>
                    <div className="info-row">
                      <span>{t("verification.overview.package")}:</span>
                      <span>{paymentInfo.package}</span>
                    </div>
                    <div className="info-row">
                      <span>{t("verification.overview.amount")}:</span>
                      <span>{paymentInfo.amount} {paymentInfo.currency}</span>
                    </div>
                  </>
                ) : (
                  <div className="no-data">No payment information available</div>
                )}
              </div>
            </div>
          </div>
        )}

{activeTab === "course" && (
  <div className="course-details">
    <h3>{t("verification.course.title")}</h3>
    <div className="detail-card">
      <div className="detail-item">
        <span className="detail-label">{t("verification.course.id")}</span>
        <span className="detail-value">{courseId || t("verification.common.na")}</span>
      </div>
      {courseName && (
        <div className="detail-item">
          <span className="detail-label">{t("verification.course.name")}</span>
          <span className="detail-value">{courseName}</span>
        </div>
      )}
    </div>
  </div>
)}

{activeTab === "payment" && (
  <div className="payment-details">
    <h3>{t("verification.payment.title")}</h3>
    {paymentInfo ? (
      <div className="detail-card">
        <div className="detail-item">
          <span className="detail-label">{t("verification.payment.status")}</span>
          <span className="detail-value">
            <StatusPill status={paymentInfo.status} />
          </span>
        </div>
        <div className="detail-item">
          <span className="detail-label">{t("verification.payment.package")}</span>
          <span className="detail-value">
            <FiPackage /> {paymentInfo.package}
          </span>
        </div>
        <div className="detail-item">
          <span className="detail-label">{t("verification.payment.amount")}</span>
          <span className="detail-value">
            <FiDollarSign /> {paymentInfo.amount} {paymentInfo.currency}
          </span>
        </div>
      </div>
    ) : (
      <div className="no-data">
        {t("verification.payment.noRecords")}
      </div>
    )}
  </div>
)}

      </main>
    </div>
  );
};

export default QRView;