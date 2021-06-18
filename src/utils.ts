const dateRegex = /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}).(\d{3})Z/;

export function reviveDates(key: string, value: any) {
    let match;
    if (typeof value === 'string' && (match = value.match(dateRegex))) {
        const milliseconds = Date.parse(match[0]);
        if (!isNaN(milliseconds)) {
            return new Date(milliseconds);
        }
    }
    return value;
}
export function getName(f: any, date: Date) {
    return date.toISOString() + '_' + f.md5 + '_' + f.mimetype.replace('/', '.');
}
