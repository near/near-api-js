const https = require('https');
const fs = require('fs');
const {
    Project,
    Scope,
    WriterFunctions,
    VariableDeclarationKind
} = require('ts-morph');

const ERROR_SCHEMA_URL =
    'https://raw.githubusercontent.com/nearprotocol/nearcore/614287fb9b3e04aa10c370a6bf8f5f261ebee45e/res/rpc_errors_schema.json';
const TARGET_DIR = process.argv[2] ||  process.cwd() + '/src.ts/generated';
const TARGET_TS_FILE_PATH = TARGET_DIR + '/rpc_error_types.ts';
const TARGET_SCHEMA_FILE_PATH = TARGET_DIR + '/rpc_error_schema.json';

https
    .get(ERROR_SCHEMA_URL, resp => {
        let data = '';

        resp.on('data', chunk => {
            data += chunk;
        });

        resp.on('end', () => {
            const jsonSchema = JSON.parse(data);
            genErrorTypes(jsonSchema, TARGET_TS_FILE_PATH);
            fs.writeFileSync(TARGET_SCHEMA_FILE_PATH, data);
        });
    })
    .on('error', err => {
        console.log('Unable to fetch schema file: ' + err.message);
    });

function getSuperClassFor(schema, typeName) {
    for (let tyName in schema) {
        for (let subtype of schema[tyName].subtypes) {
            if (typeName === subtype) {
                return tyName;
            }
        }
    }
    return undefined;
}

function genErrorClass(schema, sourceFile, tyName) {
    if (sourceFile.getClass(tyName)) {
        return;
    }
    const superClassName = getSuperClassFor(schema, tyName);
    if (superClassName) {
        genErrorClass(schema, sourceFile, superClassName);
    }
    const classDecl = sourceFile.addClass({
        name: tyName
    });
    if (superClassName) {
        classDecl.setExtends(superClassName);
    }
    const type = schema[tyName];
    classDecl.setIsExported(true);
    for (let prop in type.props) {
        classDecl.addProperty({
            name: prop,
            type: type.props[prop],
            initializer: null,
            scope: Scope.Public
        });
    }
}

function genErrorTypes(jsonSchema, targetFilePath) {
    const project = new Project({});
    const sourceFile = project.createSourceFile(targetFilePath, '', {
        overwrite: true
    });

    const classMap = {};
    for (let tyName in jsonSchema.schema) {
        classMap[tyName] = tyName;
        genErrorClass(jsonSchema.schema, sourceFile, tyName);
    }
    sourceFile.saveSync();
}
