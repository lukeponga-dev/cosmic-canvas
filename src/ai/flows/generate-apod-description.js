'use server';
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateApodDescription = generateApodDescription;
/**
 * @fileOverview This file defines a Genkit flow for generating AI-powered descriptions of NASA's Astronomy Picture of the Day (APOD).
 *
 * - generateApodDescription - A function that takes an image URL and title and returns an AI-generated description.
 * - GenerateApodDescriptionInput - The input type for the generateApodDescription function.
 * - GenerateApodDescriptionOutput - The return type for the generateApodDescription function.
 */
var genkit_1 = require("@/ai/genkit");
var genkit_2 = require("genkit");
var GenerateApodDescriptionInputSchema = genkit_2.z.object({
    imageUrl: genkit_2.z.string().describe('URL of the APOD image.'),
    title: genkit_2.z.string().describe('Title of the APOD image.'),
});
var GenerateApodDescriptionOutputSchema = genkit_2.z.object({
    description: genkit_2.z.string().describe('AI-generated description of the APOD image.'),
});
function generateApodDescription(input) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, generateApodDescriptionFlow(input)];
        });
    });
}
var prompt = genkit_1.ai.definePrompt({
    name: 'apodDescriptionPrompt',
    input: { schema: GenerateApodDescriptionInputSchema },
    output: { schema: GenerateApodDescriptionOutputSchema },
    prompt: "You are an expert astronomy educator. Your task is to generate a concise and informative description of an Astronomy Picture of the Day (APOD) image, given its URL and title.\n\n  Title: {{{title}}}\n  Image URL: {{media url=imageUrl}}\n\n  Description:"
});
var generateApodDescriptionFlow = genkit_1.ai.defineFlow({
    name: 'generateApodDescriptionFlow',
    inputSchema: GenerateApodDescriptionInputSchema,
    outputSchema: GenerateApodDescriptionOutputSchema,
}, function (input) { return __awaiter(void 0, void 0, void 0, function () {
    var output;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prompt(input)];
            case 1:
                output = (_a.sent()).output;
                return [2 /*return*/, output];
        }
    });
}); });
