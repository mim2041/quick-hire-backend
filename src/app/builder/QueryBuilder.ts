import { FilterQuery, Query } from 'mongoose';

class QueryBuilder<T> {
    public modelQuery: Query<T[], T>;
    public query: Record<string, unknown>;
    public filterQuery: FilterQuery<T> = {};

    constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
        this.modelQuery = modelQuery;
        this.query = query;
    }

    search(searchableFields: string[]) {
        const searchTerm = this?.query?.searchTerm as string;
        if (searchTerm) {
            const words = searchTerm.split(' ').filter(word => word.trim() !== '');
            this.modelQuery = this.modelQuery.find({
                $or: searchableFields.filter(field => field !== "serialID").map((field) => {


                    return {
                        [field]: {
                            $regex: words.map(word => `(?=.*${word})`).join(''), // AND logic for each word
                            $options: 'i',
                        },
                    };
                }),
            });
        }

        return this;
    }

    filter(additionalFilter?: FilterQuery<T>) {
        const queryObj = { ...this.query }; // copy

        // Filtering
        const excludeFields = ['searchTerm', 'sort', 'sortBy', 'sortOrder', 'limit', 'page', 'fields'];

        excludeFields.forEach((el) => delete queryObj[el]);

        // Explicitly handle numeric fields
        if (queryObj.serialID) {
            const parsedSerialID = Number(queryObj.serialID);
            if (!isNaN(parsedSerialID)) {
                queryObj.serialID = parsedSerialID;
            } else {
                delete queryObj.serialID; // Remove invalid serialID
            }
        }

        // Handle boolean string fields
        Object.keys(queryObj).forEach(key => {
            if (queryObj[key] === 'true') {
                queryObj[key] = true;
            } else if (queryObj[key] === 'false') {
                queryObj[key] = false;
            }
        });

        // Remove undefined, null, and empty string values
        Object.keys(queryObj).forEach(key => {
            if (queryObj[key] === undefined || queryObj[key] === null || queryObj[key] === '') {
                delete queryObj[key];
            }
        });

        // Merge with additional filter if provided
        const finalFilter = { ...queryObj, ...additionalFilter } as FilterQuery<T>;
        this.filterQuery = finalFilter;
        this.modelQuery = this.modelQuery.find(finalFilter);

        return this;
    }

    // Sort the results
    sort() {
        let primarySort: string;

        if (this.query?.sort) {
            primarySort = this.query.sort.toString().split(',').join(' ');
        } else if (this.query?.sortBy) {
            const sortField = this.query.sortBy.toString();
            const sortOrder = this.query.sortOrder?.toString().toLowerCase() === 'asc' ? '' : '-';
            primarySort = `${sortOrder}${sortField}`;
        } else {
            primarySort = '-createdAt'; // Default to descending by creation date
        }

        // Add a secondary sort by `_id` to ensure consistent order for documents with the same primary sort value
        const sortOrder = `${primarySort} _id`;
        this.modelQuery = this.modelQuery.sort(sortOrder);
        return this;
    }

    // Paginate the results
    paginate() {
        const page = Math.max(Number(this.query?.page) || 1, 1); // Ensure page is at least 1
        const limit = Math.max(Number(this.query?.limit) || 10, 1); // Ensure limit is at least 1
        const skip = (page - 1) * limit;

        this.modelQuery = this.modelQuery.skip(skip).limit(limit);
        return this;
    }

    // Select specific fields to return
    fields(selectedFields?: string[]) {
        const fields = selectedFields
            ? selectedFields.join(' ')
            : this.query?.fields
                ? this.query.fields.toString().split(',').join(' ')
                : '-__v'; // Exclude `__v` by default
        this.modelQuery = this.modelQuery.select(fields);
        return this;
    }

    // Count total documents for pagination metadata
    async countTotal() {
        // const totalQueries = { ...this.modelQuery.getFilter(), isDeleted: { $ne: true } };
        const totalQueries = { ...this.filterQuery, isDeleted: { $ne: true } };
        const total = await this.modelQuery.model.countDocuments(totalQueries);
        const page = Math.max(Number(this.query?.page) || 1, 1);
        const limit = Math.max(Number(this.query?.limit) || 10, 1);
        const totalPage = Math.ceil(total / limit);

        return {
            page,
            limit,
            total,
            totalPage,
        };
    }
}

export default QueryBuilder;