import Button from 'components/Button';
import { Link } from 'react-router-dom';
import PageLayout from "layouts/PageLayout";
import TableData from "./tableData";
import { useState } from 'react';
import AiLoader from "components/AiLoader";
import { Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress, Typography, Box } from '@mui/material'; // Using MUI components assuming Material UI theme
import Input from "components/Input";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

function Projects() {
  const [open, setOpen] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGenerate = async () => {
    if (!projectName) return;
    setLoading(true);
    try {
      const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/api/v1/ai/generate-project`, {
        projectName,
        location
      });
      toast.success('Project draft generated successfully!');
      setOpen(false);
      // Navigate to edit page of the new draft
      if (data.projectId) {
        navigate(`/projects/editProjects/${data.projectId}`);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to generate project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout
      title={'Projects'}
      action={
        <div style={{ display: 'flex', gap: '10px' }}>
          
          <Button component={Link} to={`/projects/addProjects`}>Add Projects</Button>
        </div>
      }
    >
      <TableData />

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: "16px",
            background: "rgba(255, 255, 255, 0.8)",
            backdropFilter: "blur(20px)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.3)"
          }
        }}
      >
        <DialogTitle>
          <Typography variant="h5" fontWeight="medium">
            Generate Project with AI
          </Typography>
        </DialogTitle>
        <DialogContent>
          {loading ? (
            <AiLoader loading={loading} />
          ) : (
            <>
              <Typography variant="body2" color="textSecondary" mb={3}>
                Enter the project details. AI will extract SEO-optimized content, pricing, and amenities.
              </Typography>

              <Box mb={2}>
                <Typography variant="caption" fontWeight="bold" display="block" mb={1}>
                  Project Name
                </Typography>
                <Input
                  autoFocus
                  fullWidth
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="e.g. Prestige City"
                />
              </Box>

              <Box mb={2}>
                <Typography variant="caption" fontWeight="bold" display="block" mb={1}>
                  City / Location (Optional)
                </Typography>
                <Input
                  fullWidth
                  placeholder="e.g. Whitefield, Bangalore"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </Box>
            </>
          )}
        </DialogContent>
        {!loading && (
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setOpen(false)} color="secondary">Cancel</Button>
            <Button
              onClick={handleGenerate}
              variant="contained"
              color="info"
            >
              Generate Draft
            </Button>
          </DialogActions>
        )}
      </Dialog>
    </PageLayout>
  );
}

export default Projects;
