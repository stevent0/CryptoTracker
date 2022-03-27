import axios from 'axios'

const URI = `http://localhost:5000`

export async function logIn(email, password) {

    return await axios({
        method: 'post',
        url: `${URI}/accounts/user/login`,
        data: {
            "email": email,
            "password": password,
        },
        headers: {
            "Content-Type": "application/json",
            'Accept': 'application/json',
        }
    })
}

export async function signUp(name, email, password, confirmPassword) {
    return await axios({
        method: 'post',
        url: `${URI}/accounts/user/signup`,
        data: {
            name,
            email,
            password,
            confirmPassword,
        }
    })
}

export async function addAsset(userId, asset, jwt) {
    const { cryptoId, label, publicAddress, amount } = asset
    return await axios({
        method: 'post',
        url: `${URI}/users/${userId}/assets`,
        data: {
            cryptoId,
            label,
            publicAddress,
            amount,
            userId,
        },
        headers: {
            Authorization: `Bearer ${jwt}`
        }
    })
}

export async function getAssets(userId, jwt, searchKey) {

    let url = `${URI}/users/${userId}/assets`
    if (searchKey && searchKey.length > 0) url += `/${encodeURIComponent(searchKey)}`

    return axios({
        method: 'get',
        url: url,
        headers: {
            Authorization: `Bearer ${jwt}`
        }
    })
}

export async function deleteAsset(userId, assetId, jwt) {
    return await axios({
        method: 'delete',
        url: `${URI}/users/${userId}/assets/${assetId}`,
        headers: {
            Authorization: `Bearer ${jwt}`
        }
    })
}

export async function updateAsset(userId, assetId, updates, jwt) {

    return await axios({
        method: 'patch',
        url: `${URI}/users/${userId}/assets/${assetId}`,
        data: updates,
        headers: {
            Authorization: `Bearer ${jwt}`
        }
    })
}

export async function getAssetsValueOfUser(userId, jwt) {
    return await axios({
        method: 'get',
        url: `${URI}/users/${userId}/assets-value`,
        headers: {
            Authorization: `Bearer ${jwt}`
        }
    })
}

export async function getHighestAssetValueOfUser(userId, jwt) {
    return await axios({
        method: 'get',
        url: `${URI}/users/${userId}/highest-value-asset`,
        headers: {
            Authorization: `Bearer ${jwt}`
        }
    })
}

async function getSupportedAssets(searchkey) {
    return await axios({
        method: 'get',
        url: `${URI}/asset/${encodeURIComponent(searchkey)}`,
    })
}


async function apiTest() {

    try {
        const loginRes = await logIn("truongsteven107@gmail.com", "password")
        const jwt = loginRes.data.jwtToken
        const userId = loginRes.data.userId
        console.log("Successfully logged in")



        // const addAssetRes = await addAsset(userId, {cryptoId: 'ETH', label: 'My ETH XD2', publicAddress: 'addy', amount: 1.53}, jwt)
        // console.log("Successfully added an asset")
 
        // const getAssetsRes = await getAssets(userId, jwt)
        // console.log(getAssetsRes.data)

        // await deleteAsset(userId, 6, jwt)
        // console.log("Successfully deleted an asset")

        // await updateAsset(userId, 5, { label: `hehexd`, publicAddress: `addy`, amount: 1.53 }, jwt)
        // console.log("Successfully updated an asset")

        // const getAssetValueRes = await getAssetsValueOfUser(userId, jwt)
        // console.log(getAssetValueRes.data)

        // const supported = await getSupportedAssets("BTC")
        // console.log(supported.data)
    }
    catch (err) {
        console.log(err.message)
    }

}


