export const getSettings = (req, res) => {
  res.status(200).json({
    availability: {
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      startTime: '09:00',
      endTime: '17:00',
      allowOverlap: false,
    },
    services: [],
    googleReviewUrl: '',
    reviewAutomation: {
      enabled: false,
      firstDelay: 1,
      maxReminders: 2,
      interval: 2,
    },
    winBackAutomation: {
      enabled: false,
      delay: 30,
      messageType: 'Both',
      message: "Hi! We haven't seen you in a while. We'd love to have you back! Use code WELCOMEBACK for 10% off your next session.",
    },
  });
};

export const updateSettings = (req, res) => {
  res.status(200).json(req.body);
};
