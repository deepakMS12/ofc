import {
  Card,
  CardContent,
  Box,

} from "@mui/material";




const DashboardCard = ({ children}:any) => {



  return (
    <Card
      elevation={0}
      sx={{
        width:"100%",
        maxHeight: 200,
        minHeight: 200,
        maxWidth: 400,
        borderRadius: 3,
        border: "1px solid #bdbdbd",
  
        backgroundColor: "white",    
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "box-shadow 0.2s, border-color 0.2s",
       
      }}
    >
      <CardContent sx={{ flex: 1, display: "flex", flexDirection: "column", p: 2 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 1,
            mb: 1,
          }}
        >
          {children}
     
        </Box>
   
   
    
      </CardContent>
    </Card>
  );
};

export default DashboardCard;
