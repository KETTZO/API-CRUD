import express from 'express';

router.get("/", (req, res) => {
    res.send("Sign Out")
});

export default router;