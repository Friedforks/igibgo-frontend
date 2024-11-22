export type Tag={
    label:string;
    fixed:boolean;
}

export const Constants = {
    requestBaseUrl: "http://localhost:8000",
    // requestBaseUrl: "http://igibgo.cloud:8001",
    version: "1.3.0",
    fixedTags: [
        'IGCSE',
        'IB',
        'Computer Science',
        'Mathematics',
        'Physics',
        'Chemistry',
        'Biology',
        'ESS',
        'Sports',
        'History',
        'Geography',
        'Economics',
        'Business',
        'Psychology',
        'Chinese',
        'English',
        'Spanish',
        'Drama',
        'Music',
        'Visual Arts',
        'Design Technology',
        'Theatre',
        'CAS',
        'TOK',
        'EE',
        'Paper 1',
        'Paper 2',
        'Paper 3',
        'Coursework',
        'Internal Assessment',
        'Individual Oral',
    ]
}