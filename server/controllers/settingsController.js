const OrganizationSetting = require('../models/OrganizationSettings');

// ✅ GET /api/settings/org
const getOrgSettings = async (req, res) => {
  try {
    const settings = await OrganizationSetting.findOne();
    if (!settings) {
      return res.status(404).json({ message: "Organization settings not found." });
    }
    res.status(200).json(settings);
  } catch (error) {
    console.error("Get Settings Error:", error);
    res.status(500).json({ message: "Server error fetching settings.", error: error.message });
  }
};

// ✅ PUT /api/settings/org
const updateOrgSettings = async (req, res) => {
  try {
    const { companyName, address, contactEmail, contactPhone, timezone, workingDays } = req.body;

    let settings = await OrganizationSetting.findOne();

    if (!settings) {
      settings = new OrganizationSetting({ companyName, address, contactEmail, contactPhone, timezone, workingDays });
    } else {
      settings.companyName = companyName || settings.companyName;
      settings.address = address || settings.address;
      settings.contactEmail = contactEmail || settings.contactEmail;
      settings.contactPhone = contactPhone || settings.contactPhone;
      settings.timezone = timezone || settings.timezone;
      settings.workingDays = workingDays || settings.workingDays;
    }

    settings.updatedAt = new Date();
    await settings.save();

    res.status(200).json({ message: "Organization settings updated successfully", settings });
  } catch (error) {
    console.error("Update Settings Error:", error);
    res.status(500).json({ message: "Server error updating settings.", error: error.message });
  }
};

// ✅ POST /api/settings/logo
const uploadLogo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No logo file uploaded." });
    }

    const logoPath = `uploads/${req.file.filename}`;
    let settings = await OrganizationSetting.findOne();

    if (!settings) {
      settings = new OrganizationSetting({ companyName: "Default Company", logo: logoPath });
    } else {
      settings.logo = logoPath;
    }

    await settings.save();
    res.status(200).json({ message: "Logo uploaded successfully", logo: logoPath });
  } catch (error) {
    console.error("Logo Upload Error:", error);
    res.status(500).json({ message: "Server error uploading logo.", error: error.message });
  }
};

module.exports = { getOrgSettings, updateOrgSettings, uploadLogo };
