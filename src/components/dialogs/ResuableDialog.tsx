import * as React from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import { Box, Divider, Typography } from "@mui/material";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiPaper-root": {
    width: "65%",
    maxWidth: "65%",
    backgroundColor: "#f2f2f2",
  },
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
    backgroundColor: "#f2f2f2",
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const ResuableDialog = ({ open, close, title, children,subTitle }: any) => {
  return (
    <React.Fragment>
      <BootstrapDialog
        onClose={close}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle
          sx={{
            m: 0,
         
          }}
          id="customized-dialog-title"
        >
          <Typography variant="h6" sx={{ fontWeight: 600, color: "#233044" }}>
           
            {title}
          </Typography>
               <Typography variant="body2" sx={{  color: "#233044" }}>
           
            {subTitle}
          </Typography>

        </DialogTitle>

        <Divider />
        <Box sx={{ overflow: "hidden", py: 1, display:"flex", justifyContent:"center",alignItems:"center" }}>{children}</Box>
        <DialogActions>
          <Button autoFocus onClick={close}>
            Ok, Close it
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </React.Fragment>
  );
};

export default ResuableDialog;
