import express, { Router } from "express"
import upload from "../middlewares/upload.middlewares.js";
import { bundleDownloadInfo, createGuestBundleShare, deleteFile, downloadInfo, downloadFile, generateQR, generateShareShortenLink, getDownloadCount, getFileDetails, getUserFiles, guestBundleDownloadInfo, resolveShareLink, searchFiles, sendLinkEmail, showUserFiles, updateAllFileExpiry, updateFileExpiry, updateFilePassword, updateFileStatus, uploadFiles, verifyBundlePassword, verifyFilePassword, verifyGuestBundlePassword, uploadFilesGuest, guestDownloadInfo, verifyGuestFilePassword ,  } from "../controllers/file.controller.js";


const router=Router();

router.post("/upload", upload.array('files'), uploadFiles);
router.post("/upload-guest", upload.array('files'), uploadFilesGuest);

router.get("/download/:fileId",downloadFile);
router.delete("/delete/:fileId",deleteFile);
router.put("/update/:fileId",updateFileStatus);
router.get("/getFileDetails/:fileId",getFileDetails);
router.post('/generateShareShortenLink', generateShareShortenLink);
router.post('/sendLinkEmail', sendLinkEmail);

router.post('/FileExpiry', updateFileExpiry);
router.post('/updateAllFileExpiry', updateAllFileExpiry);
router.post('/updateFilePassword', updateFilePassword);
router.get('/searchFiles', searchFiles);
router.get('/showUserFiles', showUserFiles);

router.get('/generateQR/:fileId', generateQR);
router.get('/getDownloadCount/:fileId', getDownloadCount);

router.get('/f/:shortCode',downloadInfo);
router.get('/g/:shortCode',guestDownloadInfo);
router.get('/bundle/:bundleCode', bundleDownloadInfo);
router.get('/guest-bundle/:bundleCode', guestBundleDownloadInfo);

router.get('/resolveShareLink/:code', resolveShareLink);
router.post('/verifyFilePassword', verifyFilePassword);
router.post('/verifyGuestFilePassword', verifyGuestFilePassword);
router.post('/verifyBundlePassword', verifyBundlePassword);
router.post('/verifyGuestBundlePassword', verifyGuestBundlePassword);
router.post('/createGuestBundleShare', createGuestBundleShare);

router.get('/getUserFiles/:userId', getUserFiles);






export default router;
