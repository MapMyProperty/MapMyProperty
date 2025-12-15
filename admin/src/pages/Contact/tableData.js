import { useState } from "react";
import { Box, TextField, Pagination, MenuItem, Select, IconButton, Skeleton } from "@mui/material";
import { useGetContact, useUpdateContactStatus } from "queries/StoreQuery";
import whatsapp from "assets/images/whatsapp.svg";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import PropTypes from "prop-types";

// -- Styles --
const styles = {
  container: {
    background: "rgba(255, 255, 255, 0.7)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    borderRadius: "20px",
    padding: "24px",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.07)",
    border: "1px solid rgba(255, 255, 255, 0.5)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  searchField: {
    background: "rgba(255,255,255,0.8)",
    borderRadius: "10px",
    width: "300px"
  },
  tableWrapper: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: "0 10px",
  },
  th: {
    textAlign: "left",
    padding: "15px",
    color: "#888",
    fontSize: "13px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    cursor: "pointer",
    userSelect: "none"
  },
  tr: {
    background: "white",
    boxShadow: "0 2px 5px rgba(0,0,0,0.02)",
    borderRadius: "12px",
    cursor: "pointer"
  },
  td: {
    padding: "16px",
    fontSize: "14px",
    color: "#555",
    borderTop: "1px solid rgba(0,0,0,0.02)",
    borderBottom: "1px solid rgba(0,0,0,0.02)",
    verticalAlign: "middle",
  },
  statusBadge: (verified) => ({
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
    background: verified ? "rgba(46, 204, 113,0.15)" : "rgba(231, 76, 60, 0.15)",
    color: verified ? "#27ae60" : "#c0392b",
    display: "inline-block",
  }),
  // Modal Styles
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.3)",
    backdropFilter: "blur(5px)",
    zIndex: 9999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  modalContent: {
    background: "rgba(255, 255, 255, 0.95)",
    borderRadius: "24px",
    padding: "32px",
    width: "90%",
    maxWidth: "500px",
    boxShadow: "0 20px 50px rgba(0,0,0,0.1)",
    position: "relative",
  },
  modalRow: {
    marginBottom: "16px",
  },
  label: {
    fontSize: "12px",
    color: "#888",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    marginBottom: "4px",
    fontWeight: 600
  },
  value: {
    fontSize: "16px",
    color: "#333",
    fontWeight: 500,
  }
};

import ReactDOM from "react-dom";
import { useEffect } from "react";

const ContactModal = ({ data, onClose, onToggleStatus }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  if (!data) return null;

  return ReactDOM.createPortal(
    <motion.div
      style={styles.modalOverlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        style={{ ...styles.modalContent, maxHeight: "90vh", overflowY: "auto" }}
        initial={{ scale: 0.9, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, y: 20, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "20px" }}>
          <div>
            <div style={{ fontSize: "24px", fontWeight: 700, color: "#333" }}>{data.name || "Anonymous"}</div>
            <div style={{ display: "flex", gap: "10px", alignItems: "center", marginTop: "5px" }}>
              <div style={styles.statusBadge(!data.is_verified)}>{data.is_verified ? "New Enquiry" : "Viewed"}</div>
              <button
                onClick={() => onToggleStatus(data)}
                style={{
                  background: "none",
                  border: "1px solid #ddd",
                  borderRadius: "15px",
                  padding: "4px 10px",
                  fontSize: "11px",
                  cursor: "pointer",
                  fontWeight: 600,
                  color: "#666"
                }}
              >
                Mark as {data.is_verified ? "Viewed" : "New"}
              </button>
            </div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: "24px", cursor: "pointer", color: "#aaa" }}>&times;</button>
        </div>

        <div style={styles.modalRow}>
          <div style={styles.label}>Email</div>
          <div style={styles.value}>{data.email || "-"}</div>
        </div>
        <div style={styles.modalRow}>
          <div style={styles.label}>Phone</div>
          <div style={{ ...styles.value, display: "flex", alignItems: "center", gap: 10 }}>
            {data.phoneNumber}
            {data.phoneNumber && (
              <a target="_blank" rel="noreferrer" href={`https://api.whatsapp.com/send?phone=91${data.phoneNumber}&text=Hi`} style={{ opacity: 0.7 }}>
                <img src={whatsapp} width={20} alt="wa" />
              </a>
            )}
          </div>
        </div>
        <div style={styles.modalRow}>
          <div style={styles.label}>Description / Message</div>
          <div style={{ ...styles.value, background: "#f8f9fa", padding: 12, borderRadius: 8, fontSize: "14px", lineHeight: 1.5 }}>
            {data.description || "No description provided."}
          </div>
        </div>
        <div style={styles.modalRow}>
          <div style={styles.label}>Interested In</div>
          <div style={styles.value}>{data.pathname || "General Enquiry"}</div>
        </div>

        <div style={{ marginTop: 30, textAlign: "right", fontSize: "12px", color: "#aaa" }}>
          Enquiry Received: {new Date(data.createdAt).toLocaleString()}
        </div>

      </motion.div>
    </motion.div>,
    document.body
  );
};

ContactModal.propTypes = {
  data: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
    phoneNumber: PropTypes.string,
    description: PropTypes.string,
    pathname: PropTypes.string,
    createdAt: PropTypes.string,
    is_verified: PropTypes.bool,
  }),
  onClose: PropTypes.func.isRequired,
  onToggleStatus: PropTypes.func.isRequired,
};

const TableData = () => {
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");
  const [search, setSearch] = useState("");
  const [selectedContact, setSelectedContact] = useState(null);

  const { data, isLoading } = useGetContact({ page, perPage, sortBy, order, search });
  const { mutate: updateUserStatus } = useUpdateContactStatus();

  // Sort Handler
  const handleSort = (field) => {
    if (sortBy === field) {
      setOrder(order === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setOrder("desc"); // Default to desc for new fields usually
    }
  };

  const handleStatusChange = (e, userId, currentStatus) => {
    if (e) e.stopPropagation();
    const newStatus = currentStatus === "Viewed" ? "Not-Viewed" : "Viewed";
    updateUserStatus({ userId, newStatus });

    // Update local modal state if it's the same contact
    if (selectedContact && selectedContact._id === userId) {
      setSelectedContact(prev => ({ ...prev, is_verified: !prev.is_verified }));
      // Note: is_verified logic in this app seems to be: true = New/Unviewed, false = Viewed. 
      // Based on: value={item?.is_verified ? "Not-Viewed" : "Viewed"} in original code.
      // If is_verified is true, it shows "Not-Viewed". 
      // If is_verified is false, it shows "Viewed".
      // My modal badge: data.is_verified ? "New Enquiry" : "Viewed" (Consistent)
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const rowVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <TextField
          placeholder="Search contacts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          variant="outlined"
          size="small"
          sx={styles.searchField}
        />
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            size="small"
            sx={{ height: 40, background: "rgba(255,255,255,0.8)", borderRadius: "10px", minWidth: 120 }}
          >
            <MenuItem value="createdAt">Date</MenuItem>
            <MenuItem value="name">Name</MenuItem>
            <MenuItem value="is_verified">Status</MenuItem>
          </Select>
          <IconButton onClick={() => setOrder(order === "asc" ? "desc" : "asc")} sx={{ background: "rgba(255,255,255,0.8)" }}>
            <Box component="i" className={`ni ni-bold-${order === "asc" ? "up" : "down"}`} fontSize="12px" />
          </IconButton>
        </div>
      </div>

      {isLoading ? (
        <div style={{ padding: 40, textAlign: "center", color: "#888" }}>Loading Contacts...</div>
      ) : (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th} onClick={() => handleSort("name")}>User {sortBy === "name" && (order === "asc" ? "↑" : "↓")}</th>
                <th style={styles.th}>Contact</th>
                <th style={{ ...styles.th, textAlign: "center" }}>Source</th>
                <th style={styles.th} onClick={() => handleSort("createdAt")}>Date {sortBy === "createdAt" && (order === "asc" ? "↑" : "↓")}</th>
                <th style={{ ...styles.th, textAlign: "center" }} onClick={() => handleSort("is_verified")}>Status {sortBy === "is_verified" && (order === "asc" ? "↑" : "↓")}</th>
              </tr>
            </thead>
            <motion.tbody variants={containerVariants} initial="hidden" animate="visible">
              {data?.docs?.map((item) => (
                <motion.tr
                  key={item._id}
                  variants={rowVariants}
                  style={styles.tr}
                  whileHover={{ scale: 1.01, boxShadow: "0 5px 15px rgba(0,0,0,0.05)" }}
                  onClick={() => setSelectedContact(item)}
                >
                  {/* User Column */}
                  <td style={{ ...styles.td, borderTopLeftRadius: 12, borderBottomLeftRadius: 12 }}>
                    <div style={{ fontWeight: 600, color: "#333", textTransform: "capitalize" }}>{item?.name || "Anonymous"}</div>
                    <div style={{ fontSize: "12px", color: "#888" }}>{item?.email}</div>
                  </td>

                  {/* Contact Column */}
                  <td style={styles.td}>
                    {item?.phoneNumber ? (
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <a href={`tel:+91${item?.phoneNumber}`} onClick={(e) => e.stopPropagation()} style={{ color: "#333", textDecoration: "none", fontWeight: 500 }}>
                          {item.phoneNumber}
                        </a>
                      </div>
                    ) : "-"}
                  </td>

                  {/* Source Column */}
                  <td style={{ ...styles.td, textAlign: "center" }}>
                    <div style={{ background: "#f1f2f6", padding: "4px 8px", borderRadius: "6px", fontSize: "11px", display: "inline-block", color: "#666" }}>
                      {item?.pathname === "/" ? "Home" : item?.pathname?.split("/")[1] || "Unknown"}
                    </div>
                  </td>

                  {/* Date Column */}
                  <td style={styles.td}>
                    <div style={{ fontSize: "13px" }}>{new Date(item?.createdAt).toDateString()}</div>
                    <div style={{ fontSize: "11px", color: "#aaa" }}>{new Date(item?.createdAt).toLocaleTimeString()}</div>
                  </td>

                  {/* Status Column */}
                  <td style={{ ...styles.td, borderTopRightRadius: 12, borderBottomRightRadius: 12, textAlign: "center" }}>
                    <div
                      style={{ ...styles.statusBadge(!item?.is_verified), cursor: "pointer" }}
                      onClick={(e) => handleStatusChange(e, item._id, item?.is_verified ? "Not-Viewed" : "Viewed")}
                    >
                      {item?.is_verified ? "New" : "Viewed"}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </motion.tbody>
          </table>
        </div>
      )}

      <Box display="flex" justifyItems="center" justifyContent="center" mt={3}>
        <Pagination
          count={Math.ceil((data?.totalDocs || 0) / perPage)}
          page={page}
          onChange={handlePageChange}
          color="primary"
          shape="rounded"
        />
      </Box>

      {/* Modal */}
      <AnimatePresence>
        {selectedContact && (
          <ContactModal
            data={selectedContact}
            onClose={() => setSelectedContact(null)}
            onToggleStatus={(item) => handleStatusChange(null, item._id, item.is_verified ? "Not-Viewed" : "Viewed")}
          />
        )}
      </AnimatePresence>

    </div>
  );
};

export default TableData;
