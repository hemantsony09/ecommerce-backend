import db from '../../db/index.js'
import { addressesTable } from '../../db/schema/schema.js'
import { eq, and } from 'drizzle-orm'


export const getAllAddress = async (req, res) => {
    const user = req.user
    try {

        const addresses = await db.select({
            id: addressesTable.id,
            full_name: addressesTable.full_name,
            address_line: addressesTable.address_line,
            city: addressesTable.city,
            state: addressesTable.state,
            postal_code: addressesTable.postal_code,
            is_default: addressesTable.is_default,
            country: addressesTable.country
        }).from(addressesTable).where(eq(addressesTable.user_id, user.id))

        return res.status(200).json({ success: true, data: addresses })
    } catch (error) {
        return res.status(500).json({ success: false, error: "internal server error" })
    }

}

export const getAddressById = async (req, res) => {
    const { id } = req.params
    const user = req.user

    try {

        const [address] = await db.select({
            id: addressesTable.id,
            full_name: addressesTable.full_name,
            address_line: addressesTable.address_line,
            phone_no: addressesTable.phone_no,
            city: addressesTable.city,
            state: addressesTable.state,
            postal_code: addressesTable.postal_code,
            is_default: addressesTable.is_default,
            country: addressesTable.country
        }).from(addressesTable).where(and(
            eq(addressesTable.user_id, user.id),
            eq(addressesTable.id, id)
        ))
        if (!address) {
            return res.status(404).json({
                success: false,
                error: "Address not found",
            });
        }

        return res.status(200).json({ success: true, data: address })
    } catch (error) {
        return res.status(500).json({ success: false, error: "internal server error" })
    }

}










export const createAddress = async (req, res) => {
    const user = req.user
    const { full_name, address_line, phone_no, city, state, postal_code, is_default, country } = req.body
    try {
        if (full_name && address_line && phone_no && city && state && postal_code && country) {


            const [address] = await db.insert(addressesTable).values({
                user_id: user.id,
                full_name,
                phone_no,
                address_line,
                city,
                state,
                postal_code,
                is_default,
                country
            }).returning()

            return res.status(201).json({ success: true, data: address })


        }
        return res.status(400).json({ success: false, error: 'missing field' })
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            error: 'internal server error'
        })
    }
}

export const updateAddress = async (req, res) => {
    const { id } = req.params
    const user = req.user
    const { full_name, address_line, phone_no, city, state, postal_code, is_default, country } = req.body
    try {
        const updateData = {};

        if (full_name !== undefined) updateData.full_name = full_name;
        if (phone_no !== undefined) updateData.phone_no = phone_no;
        if (address_line !== undefined) updateData.address_line = address_line;
        if (city !== undefined) updateData.city = city;
        if (state !== undefined) updateData.state = state;
        if (postal_code !== undefined) updateData.postal_code = postal_code;
        if (country !== undefined) updateData.country = country;
        if (is_default !== undefined) updateData.is_default = is_default;


        const [address] = await db.update(addressesTable).set(
          updateData
        ).where(
            and(
                eq(addressesTable.id, id),
                eq(addressesTable.user_id, user.id)
            )
        ).returning()
        return res.status(200).json({ success: true, data: address })
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            error: 'internal server error'
        })
    }
}
export const deleteAddressById = async (req, res) => {
    const { id } = req.params
    const user = req.user
       
    try{
        
        const [address] = await db.delete(addressesTable).where(
            and(
                eq(addressesTable.id, id),
                eq(addressesTable.user_id, user.id)
            )
        ).returning()

        if (!address) {
    return res.status(404).json({
        success: false,
        error: "Address not found",
    });
}
        return res.status(200).json({ success: true, message:'address deleted' })
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            error: 'internal server error'
        })
    }
}
