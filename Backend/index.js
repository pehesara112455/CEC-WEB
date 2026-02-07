import express from 'express';
import cors from 'cors';
import donationRoutes from './Routes/DonationRoutes.js'; // Note the .js extension!

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/donations', donationRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});