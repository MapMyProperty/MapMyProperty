import { useState } from "react";
import { Box, TextField, Pagination, MenuItem, Select, IconButton, Skeleton, Avatar, Chip } from "@mui/material";
import { useGetProjectEnquiry, useUpdateProjectEnquiryStatus } from "queries/StoreQuery";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import whatsapp from "assets/images/whatsapp.svg";

// -- Styles --
const styles = {
  container: {
    background: "rgba(255, 255, 255, 0.8)",
    backdropFilter: "blur(20px)",
    borderRadius: "20px",
    padding: "20px",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
    border: "1px solid rgba(255, 255, 255, 0.18)",
    height: "calc(100vh - 140px)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  searchField: {
    background: "rgba(255, 255, 255, 0.6)",
    borderRadius: "12px",
    width: "300px",
    "& fieldset": { border: "none" },
  },
  tableWrapper: {
    flex: 1,
    overflow: "auto",
    borderRadius: "15px",
    boxShadow: "inset 0 0 10px rgba(0,0,0,0.02)",
  },
  table: {
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: "0 8px",
  },
  th: {
    padding: "16px",
    color: "#6c757d",
    fontWeight: "600",
    fontSize: "13px",
    textAlign: "left",
    textTransform: "uppercase",
    borderBottom: "none",
    cursor: "pointer",
    userSelect: "none",
  },
  tr: {
    background: "rgba(255, 255, 255, 0.7)",
    backdropFilter: "blur(5px)",
    borderRadius: "12px",
    transition: "all 0.2s ease",
    cursor: "default",
  },
  td: {
    padding: "16px",
    fontSize: "14px",
    color: "#555",
    borderTop: "1px solid rgba(0,0,0,0.02)",
    borderBottom: "1px solid rgba(0,0,0,0.02)",
    verticalAlign: "middle",
  },
  statusBadge: (isViewed) => ({
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
    background: isViewed ? "rgba(46, 204, 113,0.15)" : "rgba(255, 159, 67, 0.15)", // Green for Viewed, Orange for Not-Viewed
    color: isViewed ? "#27ae60" : "#e67e22",
    display: "inline-block",
  }),
  actionButton: {
    background: "rgba(255, 255, 255, 0.8)",
    borderRadius: "8px",
    padding: "6px",
    color: "#888",
    transition: "all 0.2s",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    textDecoration: "none",
    "&:hover": {
      background: "#fff",
      color: "#333",
      boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
    }
  }
};

const TableData = () => {
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");
  const [search, setSearch] = useState("");

  const { data, isLoading } = useGetProjectEnquiry({ page, perPage, sortBy, order, search });
  const { mutate: updateProjectEnquiryStatus } = useUpdateProjectEnquiryStatus();

  const handleStatusChange = (userId, newStatus) => {
    updateProjectEnquiryStatus({ userId, newStatus });
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setOrder(order === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setOrder("desc");
    }
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
          placeholder="Search enquiries..."
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
            sx={{ height: 40, background: "rgba(255,255,255,0.8)", borderRadius: "10px", minWidth: 140 }}
          >
            <MenuItem value="createdAt">Created Date</MenuItem>
            <MenuItem value="name">Name</MenuItem>
            <MenuItem value="email">Email</MenuItem>
          </Select>
          <IconButton onClick={() => setOrder(order === "asc" ? "desc" : "asc")} sx={{ background: "rgba(255,255,255,0.8)" }}>
            <Box component="i" className={`ni ni-bold-${order === "asc" ? "up" : "down"}`} fontSize="12px" />
          </IconButton>
        </div>
      </div>

      {isLoading ? (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>User Details</th>
                <th style={styles.th}>Contact Info</th>
                <th style={styles.th}>Project</th>
                <th style={{ ...styles.th, textAlign: "center" }}>Status</th>
                <th style={styles.th}>Date</th>
                <th style={{ ...styles.th, textAlign: "center" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {[...Array(6)].map((_, index) => (
                <tr key={index} style={{ background: "white", boxShadow: "0 2px 5px rgba(0,0,0,0.02)", borderRadius: "12px" }}>
                  <td style={{ ...styles.td, borderTopLeftRadius: 12, borderBottomLeftRadius: 12 }}>
                    <Box display="flex" flexDirection="column" gap={1}>
                      <Skeleton variant="text" width={120} height={20} />
                      <Skeleton variant="text" width={150} height={14} />
                    </Box>
                  </td>
                  <td style={styles.td}>
                    <Box display="flex" gap={1}>
                      <Skeleton variant="circular" width={24} height={24} />
                      <Skeleton variant="text" width={100} height={20} />
                    </Box>
                  </td>
                  <td style={styles.td}>
                    <Skeleton variant="text" width={120} height={20} />
                  </td>
                  <td style={{ ...styles.td, textAlign: "center" }}>
                    <Skeleton variant="rectangular" width={90} height={30} sx={{ borderRadius: 6, margin: "auto" }} />
                  </td>
                  <td style={styles.td}>
                    <Skeleton variant="text" width={90} height={20} />
                  </td>
                  <td style={{ ...styles.td, borderTopRightRadius: 12, borderBottomRightRadius: 12, textAlign: "center" }}>
                    <Skeleton variant="circular" width={30} height={30} sx={{ margin: "auto" }} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th} onClick={() => handleSort("name")}>User Details {sortBy === "name" && (order === "asc" ? "↑" : "↓")}</th>
                <th style={styles.th}>Contact Info</th>
                <th style={styles.th}>Project</th>
                <th style={{ ...styles.th, textAlign: "center" }}>Status</th>
                <th style={styles.th} onClick={() => handleSort("createdAt")}>Date {sortBy === "createdAt" && (order === "asc" ? "↑" : "↓")}</th>
                <th style={{ ...styles.th, textAlign: "center" }}>Action</th>
              </tr>
            </thead>
            <motion.tbody variants={containerVariants} initial="hidden" animate="visible">
              {data?.docs?.map((item) => (
                <motion.tr
                  key={item._id}
                  variants={rowVariants}
                  style={styles.tr}
                  whileHover={{ scale: 1.01, boxShadow: "0 5px 15px rgba(0,0,0,0.05)" }}
                >
                  {/* User Column */}
                  <td style={{ ...styles.td, borderTopLeftRadius: 12, borderBottomLeftRadius: 12 }}>
                    <Box display="flex" flexDirection="column">
                      <span style={{ fontWeight: 600, color: "#333", textTransform: "capitalize" }}>{item?.name}</span>
                      <a href={`mailto:${item?.email}`} style={{ fontSize: "12px", color: "#888", textDecoration: "none" }}>{item?.email}</a>
                    </Box>
                  </td>

                  {/* Contact Info Column */}
                  <td style={styles.td}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <a href={`tel:+91${item?.contactNumber}`} style={{ fontWeight: 500, color: "#555", textDecoration: "none" }}>
                        {item?.contactNumber}
                      </a>
                      <a
                        target="_blank"
                        rel="noreferrer"
                        href={`https://api.whatsapp.com/send?phone=91${item?.contactNumber}&text=Hi%C2%A0there,%C2%A0Let%27s%C2%A0have%C2%A0a%C2%A0talk`}
                      >
                        <img src={whatsapp} height={20} width={20} alt="WhatsApp" style={{ display: "block" }} />
                      </a>
                    </Box>
                  </td>

                  {/* Project Column */}
                  <td style={styles.td}>
                    {item?.projectId ? (
                      <Link
                        to={`https://www.mapmyproperty.in/property/${item?.projectId?._id}`}
                        target="_blank"
                        style={{ fontWeight: 600, color: "#11cdef", textDecoration: "none" }}
                      >
                        {item?.projectId?.title}
                      </Link>
                    ) : (
                      <span style={{ color: "#aaa" }}>-</span>
                    )}
                  </td>

                  {/* Status Column */}
                  <td style={{ ...styles.td, textAlign: "center" }}>
                    <Select
                      value={item?.isViewed ? "Viewed" : "Not-Viewed"}
                      onChange={(e) => handleStatusChange(item._id, e.target.value === "Viewed")}
                      size="small"
                      sx={{
                        height: 30,
                        fontSize: "12px",
                        borderRadius: "20px",
                        "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                        background: item?.isViewed ? "rgba(46, 204, 113,0.15)" : "rgba(255, 159, 67, 0.15)",
                        color: item?.isViewed ? "#27ae60" : "#e67e22",
                        fontWeight: 600
                      }}
                    >
                      <MenuItem value="Viewed" sx={{ fontSize: "12px", color: "#27ae60" }}>Viewed</MenuItem>
                      <MenuItem value="Not-Viewed" sx={{ fontSize: "12px", color: "#e67e22" }}>Not Viewed</MenuItem>
                    </Select>
                  </td>

                  {/* Date Column */}
                  <td style={styles.td}>
                    <div style={{ fontSize: "13px" }}>{new Date(item?.createdAt).toDateString()}</div>
                  </td>

                  {/* Action Column */}
                  <td style={{ ...styles.td, borderTopRightRadius: 12, borderBottomRightRadius: 12, textAlign: "center" }}>
                    <Link to={`/projectEnquiry/details/${item?._id}`} state={{ item }} style={styles.actionButton}>
                      <Box component="i" className="ni ni-bold-right" fontWeight="bold" fontSize="12px" />
                    </Link>
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
    </div>
  );
};

export default TableData;
