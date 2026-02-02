const express = require('express');
const router = express.Router();
const db = require('../config/database');


// function convertBlobToBase64(item) {
//   // Check if item_img exists and is a Buffer (BLOB from database)
//   if (item.item_img && Buffer.isBuffer(item.item_img)) {
//     // Convert Buffer to base64 string
//     const base64 = item.item_img.toString('base64');
    
//     // Detect image type from first bytes
//     const buffer = item.item_img;
//     let mimeType = 'image/jpeg'; // default
    
//     // PNG
//     if (buffer[0] === 0x89 && buffer[1] === 0x50) {
//       mimeType = 'image/png';
//     } 
//     // GIF
//     else if (buffer[0] === 0x47 && buffer[1] === 0x49) {
//       mimeType = 'image/gif';
//     }
//     // JPEG
//     else if (buffer[0] === 0xFF && buffer[1] === 0xD8) {
//       mimeType = 'image/jpeg';
//     }
    
//     // Return data URL format that can be used directly in <img src="">
//     return `data:${mimeType};base64,${base64}`;
//   }
  
//   // If it's already a string (URL), return as-is
//   return item.item_img;
// }

// GET all items
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM items');

        // const itemsWithBase64Images = rows.map(item => ({
        //     ...item,
        //     item_img: convertBlobToBase64(item)
        // }));

        res.json({
            success: true,
            data: rows
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Error fetching items',
            error: error.message
        });
    }
});

router.get('/top/:count', async (req, res) => {
  try {
    const count = parseInt(req.params.count) || 3
    const [items] = await db.query('SELECT * FROM items LIMIT ?', [count])

    // const itemsWithBase64Images = items.map(item => ({
    //         ...item,
    //         item_img: convertBlobToBase64(item)
    //     }));

    
    res.json({ success: true, data: items })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})


// GET single item by ID
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM items WHERE item_id = ?',
            [req.params.id]
        );
        
        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'item not found'
            });
        }

        
        res.json({
            success: true,
            data: rows[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Error fetching item',
            error: error.message
        });
    }
});

// CREATE new item
router.post('/', async (req, res) => {
    try {
        const { name, image, desc } = req.body;

        // Validate base64 image if provided
        if (image) {
            if (!image.startsWith('data:image/')) {
                return res.status(400).json({ 
                success: false, 
                error: 'Invalid image format. Must be base64 data URL' 
                });
        }

        // Check size (prevent huge images)
        const base64Size = image.length * (3/4); // Approximate bytes
        const maxSize = 50 * 1024 * 1024; // 5MB
        
        if (base64Size > maxSize) {
            return res.status(400).json({ 
            success: false, 
            error: 'Image too large. Maximum 5MB' 
            });
        }
        }

                
        const [result] = await db.query(
            'INSERT INTO items (item_name, item_img, item_desc) VALUES (?, ?, ?)',
            [name, image, desc]
        );
        
        res.status(201).json({
            success: true,
            message: 'item created successfully',
            data: {
                item_id: result.insertId,
                item_name: name,
                item_img: image,
                item_desc: desc
            }
        });
    } catch (error) {
        console.error(error);

        // Check if error is due to data being too large
        if (error.code === 'ER_DATA_TOO_LONG' || error.code === 'ER_NET_PACKET_TOO_LARGE') {
        return res.status(400).json({ 
            success: false, 
            error: 'Image is too large for database. Try a smaller image.' 
        });
        }

        
        res.status(500).json({
            success: false,
            message: 'Error creating item',
            error: error.message
        });
    }
});

// UPDATE item
router.put('/:id', async (req, res) => {
    try {
        const { name, img, desc } = req.body;
        const { id } = req.params;
        
        // Check if user exists
        const [existing] = await db.query('SELECT * FROM items WHERE item_id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'item not found'
            });
        }
        
        const [result] = await db.query(
            'UPDATE users SET item_name = ?, item_img = ?, item_desc = ? WHERE item_id = ?',
            [name, img, desc, id]
        );
        
        res.json({
            success: true,
            message: 'item updated successfully',
            data: { item_id, item_name, item_img, item_desc }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Error updating item',
            error: error.message
        });
    }
});

// DELETE user
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        // Check if user exists
        const [existing] = await db.query('SELECT * FROM items WHERE item_id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'item not found'
            });
        }
        
        await db.query('DELETE FROM items WHERE item_id = ?', [id]);
        
        res.json({
            success: true,
            message: 'item deleted successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Error deleting item',
            error: error.message
        });
    }
});

module.exports = router;
// export default router;  // ← Not module.exports
