import { getLicencePlateCollection } from '../db/mongodb.service';
import { LicensePlate } from '../../models/makia/entry';
import { config } from '../../config';
import FormData from 'form-data';
import { IZipEntry } from 'adm-zip';
import fs from 'fs';
import { v4 as uuid } from 'uuid';

const fetch = require('node-fetch');
const AdmZip = require('adm-zip');


export async function insertLicensePlateImages(makiaId: number, license_plate_images: string[]) {
    await getLicencePlateCollection().insertOne({
        id: makiaId,
        license_plate_images
    } as any);
}

export async function getLicensePlateImages(makiaId: number): Promise<string[] | undefined> {
    return (await getLicencePlateCollection().findOne<{ license_plate_images: string[] }>({
        id: makiaId
    }))?.license_plate_images;
}

export async function getLicensePlates(makiaIds: number[]): Promise<LicensePlate[] | undefined> {
    return (await getLicencePlateCollection().find<LicensePlate>({
        id: {
            $in: makiaIds
        }
    })).toArray();
}


export async function detectLicensePlates(image: Buffer, makiaId: number) {

    console.log('send plate to server..');
    // send to ML server
    const formData = new FormData();
    formData.append('image', image, {filename: 'image.jpg'});

    const response = await fetch(config.numberPlateUrl, {
        method: 'POST',
        body: formData
    });

    // unzip
    const zipBuffer = await response.buffer();
    const zip = new AdmZip(zipBuffer);
    const entries = zip.getEntries();

    const images = entries.map((zipEntry: IZipEntry) => {
        return zipEntry.getData();
    });

    console.log('got ' + images.length + 'plate entries');


    // write results to disk
    const fileNames = [];
    for (let i = 0; i < images.length; i++) {
        const fileName = `/mnt/images/makia/${uuid()}_image.jpg`;
        await fs.promises.writeFile(fileName, images[i]);
        fileNames.push(fileName);
    }


    await insertLicensePlateImages(makiaId, fileNames);
}



